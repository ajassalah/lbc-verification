<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCertificateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Allow authenticated users to update certificates
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'learner_id' => 'required|exists:learners,id',
            'course_id' => 'required|exists:courses,id',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'country' => 'nullable|string|max:255',
            'cumulative_credits_earned' => 'nullable|integer',
            'cumulative_grade_point_average' => 'nullable|numeric|between:0.00,99.99',
            'reference_no' => 'required|string|max:255|unique:certificates,reference_no,' . $this->certificate->id,
            'course_start_date' => 'nullable|date',
            'course_end_date' => 'nullable|date|after:course_start_date',
            'awarding_date' => 'required|date',
            'date_of_exam' => 'nullable|date',
            'specialization' => 'nullable|string|max:255',
            'center_name' => 'nullable|string|max:255',
            'status' => 'required|string|in:Pending,Verified',
            'grade' => 'nullable|string|in:Pass,Merit,Distinction',
            'modules_data' => 'required|json',
        ];
    }
}
