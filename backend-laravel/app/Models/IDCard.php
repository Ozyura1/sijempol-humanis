<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * IDCard Model
 *
 * Represents KTP (ID Card) service applications.
 *
 * @property string $id
 * @property string $user_id
 * @property string $jenis_pengajuan
 * @property string $nama_lengkap
 * @property string $nik
 * @property string $tempat_lahir
 * @property string $tanggal_lahir
 * @property string $jenis_kelamin
 * @property string $alamat
 * @property string $rt_rw
 * @property string $kelurahan
 * @property string $kecamatan
 * @property string $kabupaten
 * @property string $provinsi
 * @property string $kode_pos
 * @property string $agama
 * @property string $status_perkawinan
 * @property string $pekerjaan
 * @property string $kewarganegaraan
 * @property string $golongan_darah
 * @property string $status
 * @property string|null $catatan_admin
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property User $user
 */
class IDCard extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'jenis_pengajuan',
        'nama_lengkap',
        'nik',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat',
        'rt_rw',
        'kelurahan',
        'kecamatan',
        'kabupaten',
        'provinsi',
        'kode_pos',
        'agama',
        'status_perkawinan',
        'pekerjaan',
        'kewarganegaraan',
        'golongan_darah',
        'status',
        'catatan_admin',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns this ID card application.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}