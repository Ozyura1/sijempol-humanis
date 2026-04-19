<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('moves', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nama_lengkap');
            $table->string('nik', 16);
            $table->text('alamat_asal');
            $table->string('rt_asal');
            $table->string('rw_asal');
            $table->string('kelurahan_asal');
            $table->string('kecamatan_asal');
            $table->string('kabupaten_asal');
            $table->string('provinsi_asal');
            $table->string('kode_pos_asal', 5);
            $table->text('alamat_tujuan');
            $table->string('rt_tujuan');
            $table->string('rw_tujuan');
            $table->string('kelurahan_tujuan');
            $table->string('kecamatan_tujuan');
            $table->string('kabupaten_tujuan');
            $table->string('provinsi_tujuan');
            $table->string('kode_pos_tujuan', 5);
            $table->string('alasan_pindah');
            $table->date('tanggal_pindah');
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
            $table->text('catatan_admin')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
            $table->index('tanggal_pindah');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('moves');
    }
};