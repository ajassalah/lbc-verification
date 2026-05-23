<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCertificateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Changed to true to allow authenticated users to create certificates
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $allowManualCertificateReference = (bool) $this->user()?->allow_manual_certificate_reference;

        return [
            'learner_id' => 'required|exists:learners,id',
            'course_id' => 'required|exists:courses,id',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'country' => 'nullable|string|max:255',
            'cumulative_credits_earned' => 'nullable|integer',
            'cumulative_grade_point_average' => 'nullable|numeric|between:0.00,99.99',
            'reference_no' => $allowManualCertificateReference
                ? ['required', 'string', 'max:255', 'unique:certificates,reference_no']
                : ['nullable', 'string', 'max:255'],
            'course_start_date' => 'nullable|date',
            'course_end_date' => 'nullable|date|after:course_start_date',
            'awarding_date' => 'required|date',
            'date_of_exam' => 'nullable|date',
            'specialization' => 'nullable|string|max:255',
            'center_name' => 'nullable|string|max:255',
            'status' => 'required|string|in:Pending,Verified',
            'grade' => 'nullable|string|in:Pass,Merit,Distinction',
            'created_by' => 'required|exists:users,id',
            'modules_data' => 'required|json',
        ];
    }
}
