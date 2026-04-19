<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Marriage extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'nama_pria',
        'nik_pria',
        'tempat_lahir_pria',
        'tanggal_lahir_pria',
        'nama_wanita',
        'nik_wanita',
        'tempat_lahir_wanita',
        'tanggal_lahir_wanita',
        'tanggal_perkawinan',
        'tempat_perkawinan',
        'nama_wali',
        'nama_saksi_1',
        'nama_saksi_2',
        'alamat',
        'status',
        'catatan_admin',
    ];

    protected $casts = [
        'tanggal_lahir_pria' => 'date',
        'tanggal_lahir_wanita' => 'date',
        'tanggal_perkawinan' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}