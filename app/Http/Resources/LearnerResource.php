<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class LearnerResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return
            [
                'id' => $this->id,
                'prefix' => $this->prefix,
                'full_name' => $this->full_name,
                'name_with_initials' => $this->name_with_initials,
                'date_of_birth' => $this->date_of_birth->format('Y-m-d'),
                'profile_picture' => $this->profile_picture && ! (str_starts_with($this->profile_picture, 'http')) ?
                    Storage::url($this->profile_picture) : '',
                'gender' => $this->gender,
                'email' => $this->email,
                'learner_id' => $this->learner_id,
                'proof_type' => $this->proof_type,
                'proof_id' => $this->proof_id,
                'id_proof_document' => $this->id_proof_document ? route('learners.documents.show', ['learner' => $this->id, 'document' => 'id-proof']) : '',
                'cv_document' => $this->cv_document ? route('learners.documents.show', ['learner' => $this->id, 'document' => 'cv']) : '',
                'phone_no' => $this->phone_no,
                'address_line_1' => $this->address_line_1,
                'address_line_2' => $this->address_line_2,
                'city' => $this->city,
                'state' => $this->state,
                'postal_code' => $this->postal_code,
                'country' => $this->country,
                'nationality' => $this->nationality,
                'full_address' => $this->getFullAddressAttribute(),
                'created_at' => Carbon::parse($this->created_at)->format('Y-m-d H:i'),
                'updated_at' => Carbon::parse($this->updated_at)->format('Y-m-d H:i'),
            ];
    }
}
