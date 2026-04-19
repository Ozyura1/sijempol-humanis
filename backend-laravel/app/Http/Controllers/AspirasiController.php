<?php

namespace App\Http\Controllers;

use App\Models\Aspirasi;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * AspirasiController
 *
 * Handles CRUD operations for user aspirations/feedback.
 */
class AspirasiController extends Controller
{
    /**
     * Get all aspirations.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Aspirasi::query();

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by email
            if ($request->has('email')) {
                $query->where('email', $request->email);
            }

            $aspirasis = $query->orderByDesc('created_at')->get();

            return response()->json([
                'success' => true,
                'message' => 'Aspirasi berhasil diambil',
                'data' => $aspirasis,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil aspirasi: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }

    /**
     * Store a new aspiration.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'pesan' => 'required|string|max:2000',
            ]);

            $aspirasi = Aspirasi::create([
                'nama' => $validated['nama'],
                'email' => $validated['email'],
                'pesan' => $validated['pesan'],
                'tanggal' => now()->toDateString(),
                'status' => 'baru',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Aspirasi berhasil dikirim',
                'data' => $aspirasi,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim aspirasi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a single aspiration by ID.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            $aspirasi = Aspirasi::findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Aspirasi berhasil diambil',
                'data' => $aspirasi,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Aspirasi tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil aspirasi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update aspiration status.
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $aspirasi = Aspirasi::findOrFail($id);

            $validated = $request->validate([
                'status' => 'required|in:baru,dibaca,diproses',
            ]);

            $aspirasi->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Status aspirasi berhasil diperbarui',
                'data' => $aspirasi,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Aspirasi tidak ditemukan',
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui aspirasi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an aspiration.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $aspirasi = Aspirasi::findOrFail($id);
            $aspirasi->delete();

            return response()->json([
                'success' => true,
                'message' => 'Aspirasi berhasil dihapus',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Aspirasi tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus aspirasi: ' . $e->getMessage(),
            ], 500);
        }
    }
}