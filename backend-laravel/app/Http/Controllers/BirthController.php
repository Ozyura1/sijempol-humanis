<?php

namespace App\Http\Controllers;

use App\Models\Birth;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * BirthController
 *
 * Handles CRUD operations for birth certificate service applications.
 */
class BirthController extends Controller
{
    /**
     * Get all birth applications for the authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();

            $query = Birth::where('user_id', $user->id);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $applications = $query->orderByDesc('created_at')->get();

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta kelahiran berhasil diambil',
                'data' => $applications,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengajuan akta kelahiran: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }

    /**
     * Store a new birth application.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nama_bayi' => 'required|string|max:255',
                'jenis_kelamin' => 'required|in:L,P',
                'tempat_lahir' => 'required|string|max:100',
                'tanggal_lahir' => 'required|date|before_or_equal:today',
                'jam_lahir' => 'required|date_format:H:i',
                'nama_ayah' => 'required|string|max:255',
                'nama_ibu' => 'required|string|max:255',
                'alamat' => 'required|string|max:500',
            ]);

            $user = auth()->user();

            $application = Birth::create([
                'user_id' => $user->id,
                'nama_bayi' => $validated['nama_bayi'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'tempat_lahir' => $validated['tempat_lahir'],
                'tanggal_lahir' => $validated['tanggal_lahir'],
                'jam_lahir' => $validated['jam_lahir'],
                'nama_ayah' => $validated['nama_ayah'],
                'nama_ibu' => $validated['nama_ibu'],
                'alamat' => $validated['alamat'],
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta kelahiran berhasil dibuat',
                'data' => $application,
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
                'message' => 'Gagal membuat pengajuan akta kelahiran: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a single birth application by ID.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = Birth::where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta kelahiran berhasil diambil',
                'data' => $application,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan akta kelahiran tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengajuan akta kelahiran: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a birth application (admin only).
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $application = Birth::findOrFail($id);

            $validated = $request->validate([
                'status' => 'nullable|in:pending,approved,rejected,completed',
                'catatan_admin' => 'nullable|string|max:1000',
            ]);

            $application->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta kelahiran berhasil diperbarui',
                'data' => $application,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan akta kelahiran tidak ditemukan',
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
                'message' => 'Gagal memperbarui pengajuan akta kelahiran: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a birth application.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = Birth::where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            $application->delete();

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta kelahiran berhasil dihapus',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan akta kelahiran tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus pengajuan akta kelahiran: ' . $e->getMessage(),
            ], 500);
        }
    }
}