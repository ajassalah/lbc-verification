<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OldCertificateResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'student_name' => $this->student_name,
            'student_email' => $this->student_email,
            'student_phone' => $this->student_phone,
            'student_address' => $this->student_address,
            'student_dob' => $this->student_dob,
            'gender' => $this->gender,
            'country' => $this->country,
            'cumulative_credits_earned' => $this->cumulative_credits_earned,
            'cumulative_grade_point_average' => $this->cumulative_grade_point_average,
            'proof_type' => $this->proof_type,
            'proof_id' => $this->proof_id,
            'reference_no' => $this->reference_no,
            'course_name' => $this->course_name,
            'course_duration' => $this->course_duration,
            'course_start_date' => $this->course_start_date,
            'course_end_date' => $this->course_end_date,
            'awarding_date' => $this->awarding_date,
            'center_name' => $this->center_name,
            'status' => $this->status,
            'created_by' => $this->created_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
