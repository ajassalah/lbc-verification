<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'name',
        'code',
        'level',
        'unit_count',
        'credit_count',
        'description',
        'year',
        'created_by'
    ];

    protected $casts = [
        'unit_count' => 'integer',
        'credit_count' => 'integer',
        'year' => 'integer',
    ];
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
