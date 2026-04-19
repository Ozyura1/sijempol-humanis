<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deaths', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nama_jenazah');
            $table->string('nik_jenazah', 16);
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->date('tanggal_meninggal');
            $table->time('jam_meninggal');
            $table->string('tempat_meninggal');
            $table->string('sebab_meninggal');
            $table->string('nama_pelapor');
            $table->string('hubungan_pelapor');
            $table->text('alamat');
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
            $table->text('catatan_admin')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
            $table->index('tanggal_meninggal');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deaths');
    }
};