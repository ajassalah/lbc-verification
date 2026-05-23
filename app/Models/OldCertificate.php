<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OldCertificate extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'old_certificates';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'student_id',
        'student_name',
        'student_email',
        'student_phone',
        'student_address',
        'student_dob',
        'gender',
        'country',
        'cumulative_credits_earned',
        'cumulative_grade_point_average',
        'proof_type',
        'proof_id',
        'reference_no',
        'course_name',
        'course_duration',
        'course_start_date',
        'course_end_date',
        'awarding_date',
        'center_name',
        'status',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'cumulative_credits_earned' => 'integer',
        'cumulative_grade_point_average' => 'decimal:1',
        'created_by' => 'integer',
    ];

    /**
     * Get the user who created this certificate.
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
