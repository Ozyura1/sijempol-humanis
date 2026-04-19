<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marriages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nama_pria');
            $table->string('nik_pria', 16);
            $table->string('tempat_lahir_pria');
            $table->date('tanggal_lahir_pria');
            $table->string('nama_wanita');
            $table->string('nik_wanita', 16);
            $table->string('tempat_lahir_wanita');
            $table->date('tanggal_lahir_wanita');
            $table->date('tanggal_perkawinan');
            $table->string('tempat_perkawinan');
            $table->string('nama_wali')->nullable();
            $table->string('nama_saksi_1');
            $table->string('nama_saksi_2');
            $table->text('alamat');
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
            $table->text('catatan_admin')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
            $table->index('tanggal_perkawinan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marriages');
    }
};