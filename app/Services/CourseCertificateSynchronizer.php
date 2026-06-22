<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Course;
use Illuminate\Support\Collection;

class CourseCertificateSynchronizer
{
    /**
     * Refresh the course-controlled part of every certificate transcript while
     * retaining certificate-specific results such as grades.
     */
    public function sync(Course $course): void
    {
        $modules = $course->modules()
            ->orderBy('position')
            ->orderBy('id')
            ->get();

        Certificate::where('course_id', $course->id)
            ->chunkById(100, function (Collection $certificates) use ($modules): void {
                foreach ($certificates as $certificate) {
                    $certificate->modules_data = $this->buildModulesData(
                        $modules,
                        $this->normalizeModulesData($certificate->modules_data)
                    );
                    $certificate->save();

                    // Course name, code, duration and other relationship-backed
                    // details are live data. Touching invalidates generated PDF URLs.
                    if (! $certificate->wasChanged()) {
                        $certificate->touch();
                    }
                }
            });
    }

    private function buildModulesData(Collection $modules, array $existingData): array
    {
        $existingModules = collect($existingData['years'] ?? [])
            ->flatMap(fn ($year) => is_array($year['modules'] ?? null) ? $year['modules'] : [])
            ->filter(fn ($module) => is_array($module));

        $byId = $existingModules
            ->filter(fn ($module) => isset($module['id']))
            ->keyBy(fn ($module) => (string) $module['id']);
        $byCode = $existingModules
            ->filter(fn ($module) => ! empty($module['code']))
            ->keyBy(fn ($module) => (string) $module['code']);

        $years = [];
        $yearIndexes = [];

        foreach ($modules as $module) {
            $yearKey = $module->year === null ? '__none__' : (string) $module->year;

            if (! array_key_exists($yearKey, $yearIndexes)) {
                $yearIndexes[$yearKey] = count($years);
                $years[] = [
                    'year' => $module->year,
                    'total_credits' => 0,
                    'total_modules_count' => 0,
                    'grading_type' => 'Pending',
                    'gpa' => 0,
                    'modules' => [],
                ];
            }

            $existing = $byId->get((string) $module->id)
                ?? $byCode->get((string) $module->code)
                ?? [];

            $years[$yearIndexes[$yearKey]]['modules'][] = array_merge($existing, [
                'id' => $module->id,
                'code' => $module->code,
                'name' => $module->name,
                'level' => $module->level ?? '',
                'units' => $module->unit_count,
                'credits' => $module->credit_count,
                'grade' => $existing['grade'] ?? '',
            ]);
        }

        foreach ($years as &$year) {
            $year['total_credits'] = collect($year['modules'])
                ->sum(fn ($module) => (int) ($module['credits'] ?? 0));
            $year['total_modules_count'] = count($year['modules']);
            $year['grading_type'] = $this->gradingType($year['modules']);
        }
        unset($year);

        return array_merge($existingData, ['years' => $years]);
    }

    private function normalizeModulesData(mixed $value): array
    {
        for ($attempt = 0; $attempt < 2 && is_string($value); $attempt++) {
            $value = json_decode($value, true);
        }

        return is_array($value) ? $value : ['years' => []];
    }

    private function gradingType(array $modules): string
    {
        if ($modules === [] || collect($modules)->contains(fn ($module) => empty($module['grade']))) {
            return 'Pending';
        }

        if (collect($modules)->contains(fn ($module) => strtoupper((string) $module['grade']) === 'E')) {
            return 'Absent';
        }

        return 'Completed';
    }
}
