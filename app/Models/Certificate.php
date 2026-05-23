<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'learner_id',
        'course_id',
        'reference_no',
        'course_start_date',
        'course_end_date',
        'awarding_date',
        'date_of_exam',
        'specialization',
        'center_name',
        'status',
        'grade',
        'created_by',
        'gender',
        'country',
        'cumulative_credits_earned',
        'cumulative_grade_point_average',
        'modules_data',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the learner that owns the certificate.
     */
    public function learner(): BelongsTo
    {
        return $this->belongsTo(Learner::class);
    }

    /**
     * Get the course associated with the certificate.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Set casts for date and JSON fields
     */
    protected $casts = [
        'course_start_date' => 'date',
        'course_end_date' => 'date',
        'awarding_date' => 'date',
        'date_of_exam' => 'date',
        'modules_data' => 'json',
        'cumulative_grade_point_average' => 'decimal:1',
        'cumulative_credits_earned' => 'integer',
    ];
}
