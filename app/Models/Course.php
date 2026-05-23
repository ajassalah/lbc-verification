<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Course extends Model
{
    use HasFactory;

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::creating(function ($course) {
            if (!$course->slug) {
                $course->slug = Str::slug($course->name);
            }
            if (!$course->code) {
                // Generate a code from name or random if name is short
                $base = Str::slug($course->name, '');
                $course->code = strtoupper(substr($base, 0, 6) . rand(100, 999));
            }
        });

        static::updating(function ($course) {
            if ($course->isDirty('name') && !$course->isDirty('slug')) {
                $course->slug = Str::slug($course->name);
            }
        });
    }

    protected $fillable = [
        'name',
        'code',
        'slug',
        'description',
        'entry_requirements',
        'image',
        'level',
        'duration', // Duration in months
        'fee',
        'total_credits',
        'faculty',
        'course_start_date',
        'course_end_date',
        'status',
        'created_by'
    ];
    protected $casts = [
        'duration' => 'integer',
        'fee' => 'decimal:2',
        'status' => 'boolean',
        'total_credits' => 'integer',
        'created_by' => 'integer',
        'course_start_date' => 'date',
        'course_end_date' => 'date',
    ];
    public function modules()
    {
        return $this->hasMany(Module::class);
    }
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
