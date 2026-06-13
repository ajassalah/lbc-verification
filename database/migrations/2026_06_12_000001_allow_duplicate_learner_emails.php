<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('learners') || ! Schema::hasColumn('learners', 'email')) {
            return;
        }

        if ($this->usesMySql()) {
            foreach ($this->singleColumnUniqueIndexes('learners', 'email') as $indexName) {
                Schema::table('learners', function (Blueprint $table) use ($indexName) {
                    $table->dropUnique($indexName);
                });
            }

            return;
        }

        try {
            Schema::table('learners', function (Blueprint $table) {
                $table->dropUnique(['email']);
            });
        } catch (Throwable) {
            // The index may already be absent on non-MySQL local databases.
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('learners') || ! Schema::hasColumn('learners', 'email')) {
            return;
        }

        if ($this->hasDuplicateEmails()) {
            return;
        }

        if ($this->usesMySql() && $this->singleColumnUniqueIndexes('learners', 'email') !== []) {
            return;
        }

        Schema::table('learners', function (Blueprint $table) {
            $table->unique('email');
        });
    }

    private function usesMySql(): bool
    {
        return in_array(DB::getDriverName(), ['mysql', 'mariadb'], true);
    }

    private function singleColumnUniqueIndexes(string $table, string $column): array
    {
        $indexes = DB::select(
            <<<'SQL'
                SELECT INDEX_NAME
                FROM INFORMATION_SCHEMA.STATISTICS
                WHERE TABLE_SCHEMA = DATABASE()
                    AND TABLE_NAME = ?
                    AND NON_UNIQUE = 0
                GROUP BY INDEX_NAME
                HAVING COUNT(*) = 1 AND MAX(COLUMN_NAME) = ?
            SQL,
            [$table, $column]
        );

        return array_map(fn ($index) => $index->INDEX_NAME, $indexes);
    }

    private function hasDuplicateEmails(): bool
    {
        return DB::table('learners')
            ->select('email')
            ->whereNotNull('email')
            ->groupBy('email')
            ->havingRaw('COUNT(*) > 1')
            ->exists();
    }
};
