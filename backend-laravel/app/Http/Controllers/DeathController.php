<?php

namespace App\Http\Controllers;

use App\Models\Death;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DeathController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $query = Death::where('user_id', $user->id);
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            $applications = $query->orderByDesc('created_at')->get();
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta kematian berhasil diambil',
                'data' => $applications,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengajuan akta kematian: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nama_jenazah' => 'required|string|max:255',
                'nik_jenazah' => 'required|string|size:16',
                'tempat_lahir' => 'required|string|max:100',
                'tanggal_lahir' => 'required|date|before:today',
                'tanggal_meninggal' => 'required|date|after_or_equal:tanggal_lahir',
                'jam_meninggal' => 'required|date_format:H:i',
                'tempat_meninggal' => 'required|string|max:255',
                'sebab_meninggal' => 'required|string|max:255',
                'nama_pelapor' => 'required|string|max:255',
                'hubungan_pelapor' => 'required|string|max:100',
                'alamat' => 'required|string|max:500',
            ]);

            $user = auth()->user();

            $application = Death::create([
                'user_id' => $user->id,
                ...$validated,
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta kematian berhasil dibuat',
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
                'message' => 'Gagal membuat pengajuan akta kematian: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = Death::where('id', $id)->where('user_id', $user->id)->firstOrFail();
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta kematian berhasil diambil',
                'data' => $application,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan akta kematian tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengajuan akta kematian: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $application = Death::findOrFail($id);
            $validated = $request->validate([
                'status' => 'nullable|in:pending,approved,rejected,completed',
                'catatan_admin' => 'nullable|string|max:1000',
            ]);
            $application->update($validated);
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta kematian berhasil diperbarui',
                'data' => $application,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan akta kematian tidak ditemukan',
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
                'message' => 'Gagal memperbarui pengajuan akta kematian: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = Death::where('id', $id)->where('user_id', $user->id)->firstOrFail();
            $application->delete();
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta kematian berhasil dihapus',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan akta kematian tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus pengajuan akta kematian: ' . $e->getMessage(),
            ], 500);
        }
    }
}