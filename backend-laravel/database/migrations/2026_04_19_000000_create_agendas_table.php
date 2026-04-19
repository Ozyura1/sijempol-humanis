<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('agendas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('layanan');
            $table->date('tanggal');
            $table->string('jam');
            $table->string('lokasi');
            $table->integer('kapasitas');
            $table->integer('terdaftar')->default(0);
            $table->text('deskripsi');
            $table->enum('status', ['tersedia', 'penuh', 'ditutup'])->default('tersedia');
            $table->timestamps();

            // Indices
            $table->index('tanggal');
            $table->index('layanan');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agendas');
    }
};