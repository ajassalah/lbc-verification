<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificateViewLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_no',
        'ip',
        'status',
        'country',
        'country_code',
        'region',
        'region_name',
        'city',
        'zip',
        'lat',
        'lon',
        'timezone',
        'isp',
        'org',
        'as',
        'proxy',
        'hosting',
        'user_agent',
    ];
}
