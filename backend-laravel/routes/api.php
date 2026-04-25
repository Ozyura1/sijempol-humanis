<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AgendaController;
use App\Http\Controllers\AspirasiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BirthController;
use App\Http\Controllers\DeathController;
use App\Http\Controllers\FamilyCardController;
use App\Http\Controllers\IDCardController;
use App\Http\Controllers\MarriageController;
use App\Http\Controllers\MoveController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth routes
Route::post('/(auth)/register', [AuthController::class, 'register']);
Route::post('/(auth)/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('profile', [AuthController::class, 'profile']);
});

// Address routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('addresses', AddressController::class);
});

// Agenda routes (public for viewing, auth for management)
Route::get('agendas', [AgendaController::class, 'index']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('agendas', [AgendaController::class, 'store']);
    Route::get('agendas/{id}', [AgendaController::class, 'show']);
    Route::put('agendas/{id}', [AgendaController::class, 'update']);
    Route::delete('agendas/{id}', [AgendaController::class, 'destroy']);
});

// Aspirasi routes
Route::post('aspirasis', [AspirasiController::class, 'store']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('aspirasis', [AspirasiController::class, 'index']);
    Route::get('aspirasis/{id}', [AspirasiController::class, 'show']);
    Route::put('aspirasis/{id}', [AspirasiController::class, 'update']);
    Route::delete('aspirasis/{id}', [AspirasiController::class, 'destroy']);
});

// Service application routes
Route::middleware('auth:sanctum')->group(function () {
    // ID Card (KTP)
    Route::apiResource('id-cards', IDCardController::class);

    // Birth Certificate
    Route::apiResource('births', BirthController::class);

    // Death Certificate
    Route::apiResource('deaths', DeathController::class);

    // Marriage Certificate
    Route::apiResource('marriages', MarriageController::class);

    // Move Certificate
    Route::apiResource('moves', MoveController::class);

    // Family Card (KK)
    Route::apiResource('family-cards', FamilyCardController::class);
});