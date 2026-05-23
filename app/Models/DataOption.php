<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class DataOption extends Model
{
    public const COURSE_FACULTY = 'course_faculty';
    public const MODULE_LEVEL = 'module_level';

    protected $fillable = [
        'type',
        'value',
        'sort_order',
    ];

    public static function valuesFor(string $type): array
    {
        if (! Schema::hasTable('data_options')) {
            return self::defaultValues($type);
        }

        $values = self::query()
            ->where('type', $type)
            ->orderBy('sort_order')
            ->orderBy('value')
            ->pluck('value')
            ->all();

        return $values ?: self::defaultValues($type);
    }

    public static function groupedValues(): array
    {
        return [
            self::COURSE_FACULTY => self::valuesFor(self::COURSE_FACULTY),
            self::MODULE_LEVEL => self::valuesFor(self::MODULE_LEVEL),
        ];
    }

    private static function defaultValues(string $type): array
    {
        return match ($type) {
            self::COURSE_FACULTY => [
                'School of Engineering',
                'School of Business',
                'School of Arts',
                'School of Computer Science',
                'School of Medicine',
                'School of Law',
                'School of Education',
            ],
            self::MODULE_LEVEL => ['3', '4', '5', '6', '7'],
            default => [],
        };
    }
}
