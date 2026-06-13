<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
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
            'reference_no' => $this->reference_no,
            'learner_id' => $this->learner_id,
            'learner' => new LearnerResource($this->whenLoaded('learner')),
            'course_id' => $this->course_id,
            'course' => new CourseResource($this->whenLoaded('course')),
            'course_start_date' => $this->course_start_date ? Carbon::parse($this->course_start_date)->format('Y-m-d') : null,
            'course_end_date' => $this->course_end_date ? Carbon::parse($this->course_end_date)->format('Y-m-d') : null,
            'awarding_date' => $this->awarding_date ? Carbon::parse($this->awarding_date)->format('Y-m-d') : null,
            'date_of_exam' => $this->date_of_exam ? Carbon::parse($this->date_of_exam)->format('Y-m-d') : null,
            'completion_letter_date' => $this->completion_letter_date ? Carbon::parse($this->completion_letter_date)->format('Y-m-d') : null,
            'medium_of_instruction' => $this->medium_of_instruction,
            'mode_of_study' => $this->mode_of_study,
            'specialization' => $this->specialization,
            'center_name' => $this->center_name,
            'status' => $this->status,
            'grade' => $this->grade,
            'gender' => $this->gender,
            'country' => $this->country,
            'cumulative_credits_earned' => $this->cumulative_credits_earned,
            'cumulative_grade_point_average' => $this->cumulative_grade_point_average,
            'modules_data' => $this->modules_data,
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::parse($this->updated_at)->format('Y-m-d H:i:s'),
            'pdf_version' => $this->updated_at ? $this->updated_at->timestamp : time(),
        ];
    }
}
