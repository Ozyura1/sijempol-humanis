# Troubleshooting: Kolom Revisi Tidak Muncul

## Kemungkinan Penyebab & Solusi

### 1. **Kolom Database Belum Ditambahkan** ⛔ (PALING KEMUNGKINAN)

Database memungkinkan belum memiliki kolom untuk menyimpan data revisi.

**Cara Mengecek & Menambahkan Kolom:**

**Opsi A: Via Adminer (Recommended)**
1. Buka **Adminer** di browser: `http://localhost:8080`
2. Login ke database `jebol` (User: `root`, Password: kosong)
3. Pilih database `jebol` → table `perkawinan_requests`
4. Jalankan SQL script dari file: `backend-laravel/add_revision_columns.sql`

**Opsi B: Via Terminal Direct MySQL**
```bash
cd backend\backend-laravel
mysql -u root jebol < add_revision_columns.sql
```

**Opsi C: Via PHP Script Otomatis**
```bash
cd backend\backend-laravel
php check_revision_columns.php
```

---

### 2. **Verifikasi SQL Columns Sudah Ada**

Jalankan query ini di Adminer untuk memastikan semua kolom tercipta:

```sql
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME='perkawinan_requests'
AND COLUMN_NAME IN (
  'request_revision_notes',
  'revision_requested_at', 
  'revision_requested_by_user_id'
);
```

**Output yang diharapkan:**
```
COLUMN_NAME                      | COLUMN_TYPE        | IS_NULLABLE
request_revision_notes           | longtext          | YES
revision_requested_at            | timestamp         | YES  
revision_requested_by_user_id    | bigint unsigned   | YES
```

---

### 3. **Testing dengan Debug Logs**

Saya sudah menambahkan debug logs ke Flutter. Sekarang:

1. **Jalankan app:** `flutter run` di `jebol_mobile/`
2. **Open detail perkawinan** yang sudah di-request revisi
3. **Lihat console logs** di VS Code untuk output seperti:
   ```
   [MarriageRegistration] Revision data received:
     request_revision_notes: Lengkapi dokumen KTP
     revision_requested_at: 2026-03-05T10:30:00
     revision_requested_by_user: Admin Perkawinan
   
   [MarriageRegistration] hasRevisionRequest = true
     requestRevisionNotes: Lengkapi dokumen KTP
   ```

---

### 4. **Jika Logs Menunjukkan Data Null**

Berarti API tidak mengembalikan data. Periksa:

**a) Backend Model Update**
Pastikan file `backend-laravel/app/Models/PerkawinanRequest.php` memiliki method `toArray()`:

```php
public function toArray()
{
    $array = parent::toArray();
    
    // Load user info for revision requested by
    if ($this->revision_requested_by_user_id) {
        try {
            $revisionUser = User::find($this->revision_requested_by_user_id);
            $array['revision_requested_by_user'] = $revisionUser?->name ?? null;
        } catch (\Throwable $e) {
            // ignore if user not found
        }
    }
    
    return $array;
}
```

**b) Restart Laravel Server**
```bash
cd backend\backend-laravel
php artisan serve
```

**c) Clear Request Cache (Flutter)**
```bash
cd jebol_mobile
flutter clean
flutter pub get
flutter run
```

---

### 5. **Workflow Testing Manual**

Untuk memastikan semuanya bekerja:

1. **Admin membuka detail perkawinan (status PENDING)**
2. **Admin klik button "Minta Revisi/Kelengkapan"** (orange button)
3. **Input catatan:** "Lengkapi dokumen KTP"
4. **Klik "Kirim"** → Success message muncul
5. **Refresh page** atau **navigate ulang ke detail**
6. **Kolom "Minta Revisi/Kelengkapan" harus muncul** dengan:
   - Catatan Revisi: Lengkapi dokumen KTP
   - Tanggal Diminta: 05/03/2026 XX:XX
   - Diminta Oleh: [Nama Admin]

---

## 📋 Checklist Debugging

- [ ] Kolom database sudah ditambahkan (cek dengan SQL query)
- [ ] Laravel server sudah direstart setelah edit model
- [ ] Flutter app sudah di-run ulang (`flutter clean` + `flutter run`)
- [ ] Admin request revisi berhasil (success message muncul)
- [ ] Console logs menunjukkan data revision yang diterima
- [ ] Data tidak null/kosong di logs

---

## 🔍 File-File yang Sudah Diubah

✅ `backend-laravel/app/Models/PerkawinanRequest.php` - Tambahan toArray()  
✅ `backend-laravel/app/Http/Controllers/Perkawinan/AdminPerkawinanController.php` - requestRevision()  
✅ `jebol_mobile/lib/modules/admin_perkawinan/model/marriage_registration.dart` - Debug logs + parsing  
✅ `jebol_mobile/lib/modules/admin_perkawinan/screen/admin_perkawinan_detail_screen.dart` - UI card  

---

## ⚠️ Jika Masih Tidak Muncul Setelah Semua Langkah

Hubungi development team dengan:
1. Screenshot console logs (dengan revision data)
2. Screenshot database columns (dari Adminer)
3. Actual API response dari endpoint `/api/perkawinan/{uuid}`
