<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

/**
 * Agenda Model
 *
 * Represents scheduled service appointments/agendas.
 *
 * @property string $id
 * @property string $title
 * @property string $layanan
 * @property string $tanggal
 * @property string $jam
 * @property string $lokasi
 * @property int $kapasitas
 * @property int $terdaftar
 * @property string $deskripsi
 * @property string $status
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Agenda extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'layanan',
        'tanggal',
        'jam',
        'lokasi',
        'kapasitas',
        'terdaftar',
        'deskripsi',
        'status',
    ];

    protected $casts = [
        'kapasitas' => 'integer',
        'terdaftar' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}