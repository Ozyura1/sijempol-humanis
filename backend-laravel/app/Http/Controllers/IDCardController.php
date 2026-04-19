<?php

namespace App\Http\Controllers;

use App\Models\IDCard;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * IDCardController
 *
 * Handles CRUD operations for KTP (ID Card) service applications.
 */
class IDCardController extends Controller
{
    /**
     * Get all ID card applications for the authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();

            $query = IDCard::where('user_id', $user->id);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $applications = $query->orderByDesc('created_at')->get();

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan KTP berhasil diambil',
                'data' => $applications,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengajuan KTP: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }

    /**
     * Store a new ID card application.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'jenis_pengajuan' => 'required|in:baru,perpanjangan,penggantian',
                'nama_lengkap' => 'required|string|max:255',
                'nik' => 'required|string|size:16|unique:id_cards,nik',
                'tempat_lahir' => 'required|string|max:100',
                'tanggal_lahir' => 'required|date|before:today',
                'jenis_kelamin' => 'required|in:L,P',
                'alamat' => 'required|string|max:500',
                'rt_rw' => 'required|string|max:10',
                'kelurahan' => 'required|string|max:100',
                'kecamatan' => 'required|string|max:100',
                'kabupaten' => 'required|string|max:100',
                'provinsi' => 'required|string|max:100',
                'kode_pos' => 'required|string|size:5',
                'agama' => 'required|string|max:50',
                'status_perkawinan' => 'required|string|max:50',
                'pekerjaan' => 'required|string|max:100',
                'kewarganegaraan' => 'required|string|max:50',
                'golongan_darah' => 'nullable|string|max:3',
            ]);

            $user = auth()->user();

            $application = IDCard::create([
                'user_id' => $user->id,
                'jenis_pengajuan' => $validated['jenis_pengajuan'],
                'nama_lengkap' => $validated['nama_lengkap'],
                'nik' => $validated['nik'],
                'tempat_lahir' => $validated['tempat_lahir'],
                'tanggal_lahir' => $validated['tanggal_lahir'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'alamat' => $validated['alamat'],
                'rt_rw' => $validated['rt_rw'],
                'kelurahan' => $validated['kelurahan'],
                'kecamatan' => $validated['kecamatan'],
                'kabupaten' => $validated['kabupaten'],
                'provinsi' => $validated['provinsi'],
                'kode_pos' => $validated['kode_pos'],
                'agama' => $validated['agama'],
                'status_perkawinan' => $validated['status_perkawinan'],
                'pekerjaan' => $validated['pekerjaan'],
                'kewarganegaraan' => $validated['kewarganegaraan'],
                'golongan_darah' => $validated['golongan_darah'],
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan KTP berhasil dibuat',
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
                'message' => 'Gagal membuat pengajuan KTP: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a single ID card application by ID.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = IDCard::where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan KTP berhasil diambil',
                'data' => $application,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan KTP tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengajuan KTP: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an ID card application (admin only).
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $application = IDCard::findOrFail($id);

            $validated = $request->validate([
                'status' => 'nullable|in:pending,approved,rejected,completed',
                'catatan_admin' => 'nullable|string|max:1000',
            ]);

            $application->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan KTP berhasil diperbarui',
                'data' => $application,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan KTP tidak ditemukan',
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
                'message' => 'Gagal memperbarui pengajuan KTP: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an ID card application.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = IDCard::where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            $application->delete();

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan KTP berhasil dihapus',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan KTP tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus pengajuan KTP: ' . $e->getMessage(),
            ], 500);
        }
    }
}