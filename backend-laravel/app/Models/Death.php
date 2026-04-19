<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Death Model
 *
 * Represents death certificate service applications.
 */
class Death extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'nama_jenazah',
        'nik_jenazah',
        'tempat_lahir',
        'tanggal_lahir',
        'tanggal_meninggal',
        'jam_meninggal',
        'tempat_meninggal',
        'sebab_meninggal',
        'nama_pelapor',
        'hubungan_pelapor',
        'alamat',
        'status',
        'catatan_admin',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_meninggal' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}