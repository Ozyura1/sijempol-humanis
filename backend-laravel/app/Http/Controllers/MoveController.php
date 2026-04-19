<?php

namespace App\Http\Controllers;

use App\Models\Move;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MoveController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $query = Move::where('user_id', $user->id);
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            $applications = $query->orderByDesc('created_at')->get();
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan pindah berhasil diambil',
                'data' => $applications,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengajuan pindah: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nama_lengkap' => 'required|string|max:255',
                'nik' => 'required|string|size:16',
                'alamat_asal' => 'required|string|max:500',
                'rt_asal' => 'required|string|max:10',
                'rw_asal' => 'required|string|max:10',
                'kelurahan_asal' => 'required|string|max:100',
                'kecamatan_asal' => 'required|string|max:100',
                'kabupaten_asal' => 'required|string|max:100',
                'provinsi_asal' => 'required|string|max:100',
                'kode_pos_asal' => 'required|string|size:5',
                'alamat_tujuan' => 'required|string|max:500',
                'rt_tujuan' => 'required|string|max:10',
                'rw_tujuan' => 'required|string|max:10',
                'kelurahan_tujuan' => 'required|string|max:100',
                'kecamatan_tujuan' => 'required|string|max:100',
                'kabupaten_tujuan' => 'required|string|max:100',
                'provinsi_tujuan' => 'required|string|max:100',
                'kode_pos_tujuan' => 'required|string|size:5',
                'alasan_pindah' => 'required|string|max:255',
                'tanggal_pindah' => 'required|date|after:today',
            ]);

            $user = auth()->user();

            $application = Move::create([
                'user_id' => $user->id,
                ...$validated,
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan pindah berhasil dibuat',
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
                'message' => 'Gagal membuat pengajuan pindah: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = Move::where('id', $id)->where('user_id', $user->id)->firstOrFail();
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan pindah berhasil diambil',
                'data' => $application,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan pindah tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengajuan pindah: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $application = Move::findOrFail($id);
            $validated = $request->validate([
                'status' => 'nullable|in:pending,approved,rejected,completed',
                'catatan_admin' => 'nullable|string|max:1000',
            ]);
            $application->update($validated);
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan pindah berhasil diperbarui',
                'data' => $application,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan pindah tidak ditemukan',
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
                'message' => 'Gagal memperbarui pengajuan pindah: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = Move::where('id', $id)->where('user_id', $user->id)->firstOrFail();
            $application->delete();
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan pindah berhasil dihapus',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan pindah tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus pengajuan pindah: ' . $e->getMessage(),
            ], 500);
        }
    }
}