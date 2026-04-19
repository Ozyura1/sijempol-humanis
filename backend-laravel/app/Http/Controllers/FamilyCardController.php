<?php

namespace App\Http\Controllers;

use App\Models\FamilyCard;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FamilyCardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $query = FamilyCard::where('user_id', $user->id);
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            $applications = $query->orderByDesc('created_at')->get();
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan kartu keluarga berhasil diambil',
                'data' => $applications,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengajuan kartu keluarga: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'jenis_pengajuan' => 'required|in:baru,perpanjangan,penggantian',
                'no_kk' => 'nullable|string|size:16',
                'nama_kepala_keluarga' => 'required|string|max:255',
                'alamat' => 'required|string|max:500',
                'rt' => 'required|string|max:10',
                'rw' => 'required|string|max:10',
                'kelurahan' => 'required|string|max:100',
                'kecamatan' => 'required|string|max:100',
                'kabupaten' => 'required|string|max:100',
                'provinsi' => 'required|string|max:100',
                'kode_pos' => 'required|string|size:5',
            ]);

            $user = auth()->user();

            $application = FamilyCard::create([
                'user_id' => $user->id,
                ...$validated,
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan kartu keluarga berhasil dibuat',
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
                'message' => 'Gagal membuat pengajuan kartu keluarga: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = FamilyCard::where('id', $id)->where('user_id', $user->id)->firstOrFail();
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan kartu keluarga berhasil diambil',
                'data' => $application,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan kartu keluarga tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengajuan kartu keluarga: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $application = FamilyCard::findOrFail($id);
            $validated = $request->validate([
                'status' => 'nullable|in:pending,approved,rejected,completed',
                'catatan_admin' => 'nullable|string|max:1000',
            ]);
            $application->update($validated);
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan kartu keluarga berhasil diperbarui',
                'data' => $application,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan kartu keluarga tidak ditemukan',
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
                'message' => 'Gagal memperbarui pengajuan kartu keluarga: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = FamilyCard::where('id', $id)->where('user_id', $user->id)->firstOrFail();
            $application->delete();
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan kartu keluarga berhasil dihapus',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan kartu keluarga tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus pengajuan kartu keluarga: ' . $e->getMessage(),
            ], 500);
        }
    }
}