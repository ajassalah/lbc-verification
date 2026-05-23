<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255|unique:courses,code',
            'slug' => 'nullable|string|max:255|unique:courses,slug',
            'description' => 'nullable|string',
            'entry_requirements' => 'nullable|string',
            'image' => 'nullable|file|image|max:5120', // 5MB max size for image
            'level' => 'nullable|string|max:255',
            'duration' => 'nullable|integer|min:1',
            'fee' => 'nullable|numeric|min:0',
            'faculty' => 'required|string|max:255',
            'course_start_date' => 'nullable|date',
            'course_end_date' => 'nullable|date|after_or_equal:course_start_date',
            'status' => 'boolean',
            'modules' => 'array',
            'modules.*.name' => 'required|string|max:255|distinct',
            'modules.*.code' => 'required|string|max:255|unique:modules,code',
            'modules.*.level' => 'nullable|string|max:255',
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'modules.*.name.required' => 'Module name is required',
            'modules.*.name.distinct' => 'Duplicate module name found. Each module must have a unique name',
            'modules.*.code.required' => 'Module code is required',
            'modules.*.code.unique' => 'This module code is already in use',
            'modules.*.year.integer' => 'Year must be a number',
            'modules.*.year.min' => 'Year must be at least 1',
            'modules.*.year.max' => 'Year cannot be greater than 7',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $modules = $this->input('modules', []);
            $moduleNames = [];

            foreach ($modules as $index => $module) {
                if (isset($module['name'])) {
                    $name = strtolower(trim($module['name']));
                    if (in_array($name, $moduleNames)) {
                        $validator->errors()->add("modules.{$index}.name", 'Duplicate module name found. Each module must have a unique name');
                    } else {
                        $moduleNames[] = $name;
                    }
                }
            }
        });
    }
}
