<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateViewLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference_no' => $this->reference_no,
            'ip' => $this->ip,
            'status' => $this->status,
            'country' => $this->country,
            'country_code' => $this->country_code,
            'region' => $this->region,
            'region_name' => $this->region_name,
            'city' => $this->city,
            'zip' => $this->zip,
            'lat' => $this->lat,
            'lon' => $this->lon,
            'timezone' => $this->timezone,
            'isp' => $this->isp,
            'org' => $this->org,
            'as' => $this->as,
            'proxy' => $this->proxy,
            'hosting' => $this->hosting,
            'user_agent' => $this->user_agent,
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::parse($this->updated_at)->format('Y-m-d H:i:s'),
        ];
    }
}
