<?php

namespace App\Http\Controllers;

use App\Models\Marriage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MarriageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $query = Marriage::where('user_id', $user->id);
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            $applications = $query->orderByDesc('created_at')->get();
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta perkawinan berhasil diambil',
                'data' => $applications,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengajuan akta perkawinan: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nama_pria' => 'required|string|max:255',
                'nik_pria' => 'required|string|size:16',
                'tempat_lahir_pria' => 'required|string|max:100',
                'tanggal_lahir_pria' => 'required|date|before:today',
                'nama_wanita' => 'required|string|max:255',
                'nik_wanita' => 'required|string|size:16',
                'tempat_lahir_wanita' => 'required|string|max:100',
                'tanggal_lahir_wanita' => 'required|date|before:today',
                'tanggal_perkawinan' => 'required|date|after:today',
                'tempat_perkawinan' => 'required|string|max:255',
                'nama_wali' => 'nullable|string|max:255',
                'nama_saksi_1' => 'required|string|max:255',
                'nama_saksi_2' => 'required|string|max:255',
                'alamat' => 'required|string|max:500',
            ]);

            $user = auth()->user();

            $application = Marriage::create([
                'user_id' => $user->id,
                ...$validated,
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta perkawinan berhasil dibuat',
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
                'message' => 'Gagal membuat pengajuan akta perkawinan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = Marriage::where('id', $id)->where('user_id', $user->id)->firstOrFail();
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta perkawinan berhasil diambil',
                'data' => $application,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan akta perkawinan tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengajuan akta perkawinan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $application = Marriage::findOrFail($id);
            $validated = $request->validate([
                'status' => 'nullable|in:pending,approved,rejected,completed',
                'catatan_admin' => 'nullable|string|max:1000',
            ]);
            $application->update($validated);
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta perkawinan berhasil diperbarui',
                'data' => $application,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan akta perkawinan tidak ditemukan',
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
                'message' => 'Gagal memperbarui pengajuan akta perkawinan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = Marriage::where('id', $id)->where('user_id', $user->id)->firstOrFail();
            $application->delete();
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan akta perkawinan berhasil dihapus',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan akta perkawinan tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus pengajuan akta perkawinan: ' . $e->getMessage(),
            ], 500);
        }
    }
}