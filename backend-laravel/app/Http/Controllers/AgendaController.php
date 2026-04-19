<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * AgendaController
 *
 * Handles CRUD operations for service agendas/appointments.
 */
class AgendaController extends Controller
{
    /**
     * Get all agendas.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Agenda::query();

            // Filter by layanan
            if ($request->has('layanan')) {
                $query->where('layanan', $request->layanan);
            }

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by date range
            if ($request->has('start_date')) {
                $query->where('tanggal', '>=', $request->start_date);
            }
            if ($request->has('end_date')) {
                $query->where('tanggal', '<=', $request->end_date);
            }

            $agendas = $query->orderBy('tanggal')->orderBy('jam')->get();

            return response()->json([
                'success' => true,
                'message' => 'Agenda berhasil diambil',
                'data' => $agendas,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil agenda: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }

    /**
     * Store a new agenda.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'layanan' => 'required|string|max:100',
                'tanggal' => 'required|date|after:today',
                'jam' => 'required|string|max:50',
                'lokasi' => 'required|string|max:255',
                'kapasitas' => 'required|integer|min:1',
                'deskripsi' => 'required|string|max:1000',
                'status' => 'nullable|in:tersedia,penuh,ditutup',
            ]);

            $agenda = Agenda::create([
                'title' => $validated['title'],
                'layanan' => $validated['layanan'],
                'tanggal' => $validated['tanggal'],
                'jam' => $validated['jam'],
                'lokasi' => $validated['lokasi'],
                'kapasitas' => $validated['kapasitas'],
                'terdaftar' => 0,
                'deskripsi' => $validated['deskripsi'],
                'status' => $validated['status'] ?? 'tersedia',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Agenda berhasil dibuat',
                'data' => $agenda,
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
                'message' => 'Gagal membuat agenda: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a single agenda by ID.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            $agenda = Agenda::findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Agenda berhasil diambil',
                'data' => $agenda,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Agenda tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil agenda: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an agenda.
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $agenda = Agenda::findOrFail($id);

            $validated = $request->validate([
                'title' => 'nullable|string|max:255',
                'layanan' => 'nullable|string|max:100',
                'tanggal' => 'nullable|date|after:today',
                'jam' => 'nullable|string|max:50',
                'lokasi' => 'nullable|string|max:255',
                'kapasitas' => 'nullable|integer|min:1',
                'deskripsi' => 'nullable|string|max:1000',
                'status' => 'nullable|in:tersedia,penuh,ditutup',
            ]);

            $agenda->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Agenda berhasil diperbarui',
                'data' => $agenda,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Agenda tidak ditemukan',
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
                'message' => 'Gagal memperbarui agenda: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an agenda.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $agenda = Agenda::findOrFail($id);
            $agenda->delete();

            return response()->json([
                'success' => true,
                'message' => 'Agenda berhasil dihapus',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Agenda tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus agenda: ' . $e->getMessage(),
            ], 500);
        }
    }
}