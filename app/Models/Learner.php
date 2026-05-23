<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Learner extends Model
{
    use HasFactory;

    protected $fillable = [
        'prefix',
        'full_name',
        'name_with_initials',
        'date_of_birth',
        'profile_picture',
        'gender',
        'email',
        'learner_id',
        'proof_type',
        'proof_id',
        'id_proof_document',
        'cv_document',
        'phone_no',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'postal_code',
        'country',
        'nationality',
    ];
    protected $casts = [
        'date_of_birth' => 'date',
    ];

    protected $appends = ['full_address'];

    /**
     * Get the full address of the learner.
     *
     * @return string
     */
    public function getFullAddressAttribute()
    {
        $address = [];
        if (isset($this->attributes['address_line_1']) && $this->attributes['address_line_1']) {
            $address[] = $this->attributes['address_line_1'];
        }
        if (isset($this->attributes['address_line_2']) && $this->attributes['address_line_2']) {
            $address[] = $this->attributes['address_line_2'];
        }
        if (isset($this->attributes['city']) && $this->attributes['city']) {
            $address[] = $this->attributes['city'];
        }
        if (isset($this->attributes['state']) && $this->attributes['state']) {
            $address[] = $this->attributes['state'];
        }
        if (isset($this->attributes['postal_code']) && $this->attributes['postal_code']) {
            $address[] = $this->attributes['postal_code'];
        }
        if (isset($this->attributes['country']) && $this->attributes['country']) {
            $address[] = $this->attributes['country'];
        }
        return implode(', ', $address);
    }
}
