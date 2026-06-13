<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLearnerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'prefix' => 'nullable|string|max:10',
            'full_name' => 'required|string|max:255',
            'name_with_initials' => 'required|string|max:255',
            'date_of_birth' => 'required|date|before:today',
            'profile_picture' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'gender' => 'required|string|in:Male,Female,Other',
            'email' => ['required', 'email'],
            'learner_id' => ['required', 'string', 'max:50', Rule::unique('learners')->ignore($this->learner)],
            'proof_type' => 'required|string|in:Passport,National ID,Driving Licence,Driving License,Other',
            'proof_id' => 'required|string|max:50',
            'id_proof_document' => 'nullable|file|mimes:pdf,png,jpg,jpeg|max:20480',
            'cv_document' => 'nullable|file|mimes:pdf,png,jpg,jpeg|max:20480',
            'phone_no' => 'nullable|string|max:20',
            'address_line_1' => 'nullable|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'nationality' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'id_proof_document.max' => 'ID Proof Document maximum upload size is 20MB.',
            'cv_document.max' => 'CV/Resume maximum upload size is 20MB.',
        ];
    }
}
