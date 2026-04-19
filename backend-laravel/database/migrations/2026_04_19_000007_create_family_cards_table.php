<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('family_cards', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('jenis_pengajuan', ['baru', 'perpanjangan', 'penggantian']);
            $table->string('no_kk', 16)->nullable();
            $table->string('nama_kepala_keluarga');
            $table->text('alamat');
            $table->string('rt');
            $table->string('rw');
            $table->string('kelurahan');
            $table->string('kecamatan');
            $table->string('kabupaten');
            $table->string('provinsi');
            $table->string('kode_pos', 5);
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
            $table->text('catatan_admin')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
            $table->index('jenis_pengajuan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('family_cards');
    }
};