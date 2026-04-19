<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Birth Model
 *
 * Represents birth certificate service applications.
 *
 * @property string $id
 * @property string $user_id
 * @property string $nama_bayi
 * @property string $jenis_kelamin
 * @property string $tempat_lahir
 * @property string $tanggal_lahir
 * @property string $jam_lahir
 * @property string $nama_ayah
 * @property string $nama_ibu
 * @property string $alamat
 * @property string $status
 * @property string|null $catatan_admin
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property User $user
 */
class Birth extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'nama_bayi',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'jam_lahir',
        'nama_ayah',
        'nama_ibu',
        'alamat',
        'status',
        'catatan_admin',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns this birth application.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}