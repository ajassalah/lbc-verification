<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CourseResource extends JsonResource
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
            'name' => $this->name,
            'code' => $this->code,
            'slug' => $this->slug,
            'description' => $this->description,
            'entry_requirements' => $this->entry_requirements,
            'image' => $this->image && ! (str_starts_with($this->image, 'http')) ?
                Storage::url($this->image) : '',
            'level' => $this->level,
            'duration' => $this->duration,
            'fee' => $this->fee,
            'faculty' => $this->faculty,
            'course_start_date' => $this->course_start_date ? Carbon::parse($this->course_start_date)->format('Y-m-d') : '',
            'course_end_date' => $this->course_end_date ? Carbon::parse($this->course_end_date)->format('Y-m-d') : '',
            'total_credits' => $this->total_credits,
            'status' => $this->status,
            'modules' => ModuleResource::collection($this->whenLoaded('modules')),
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d'),
            'updated_at' => Carbon::parse($this->updated_at)->format('Y-m-d'),
        ];
    }
}
