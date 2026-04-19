<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Move extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'nama_lengkap',
        'nik',
        'alamat_asal',
        'rt_asal',
        'rw_asal',
        'kelurahan_asal',
        'kecamatan_asal',
        'kabupaten_asal',
        'provinsi_asal',
        'kode_pos_asal',
        'alamat_tujuan',
        'rt_tujuan',
        'rw_tujuan',
        'kelurahan_tujuan',
        'kecamatan_tujuan',
        'kabupaten_tujuan',
        'provinsi_tujuan',
        'kode_pos_tujuan',
        'alasan_pindah',
        'tanggal_pindah',
        'status',
        'catatan_admin',
    ];

    protected $casts = [
        'tanggal_pindah' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}