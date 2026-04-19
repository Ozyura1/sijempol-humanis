<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

/**
 * Aspirasi Model
 *
 * Represents user aspirations/feedback/messages.
 *
 * @property string $id
 * @property string $nama
 * @property string $email
 * @property string $pesan
 * @property string $tanggal
 * @property string $status
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Aspirasi extends Model
{
    use HasUuids;

    protected $fillable = [
        'nama',
        'email',
        'pesan',
        'tanggal',
        'status',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}