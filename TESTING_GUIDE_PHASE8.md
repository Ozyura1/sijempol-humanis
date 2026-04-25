# Testing Guide - Sijempol Humanis System

Panduan lengkap untuk menguji seluruh sistem 8 fase implementation.

## Prerequisites

1. **Backend Running**

   ```bash
   cd backend
   npm install
   node server.js
   ```

   Server berjalan di `http://localhost:8000`

2. **Frontend Running**

   ```bash
   npm run dev
   ```

   Aplikasi berjalan di `http://localhost:3000`

3. **Database Setup**
   - lowdb otomatis membuat `db.json` di backend/
   - Admin user "admin" dengan password "admin123" dibuat otomatis

---

## Test Suite 1: User Registration & Authentication

### Test 1.1: Register New User

**Steps:**

1. Buka `http://localhost:3000/dashboard/register`
2. Isi form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Username: "johndoe"
   - Password: "password123"
   - Confirm Password: "password123"
3. Klik "Daftar"

**Expected Result:**

- ✅ Redirect ke `/dashboard/login?registered=true`
- ✅ Green success message: "Akun Anda telah berhasil dibuat. Silakan login."
- ✅ `db.json` memiliki entry baru di users[] dengan:
  - username: "johndoe"
  - password: hashed (bcrypt)
  - role: "user"

**Failure Scenarios:**

- ❌ Username sudah ada → Tampil error "Username sudah terdaftar"
- ❌ Password < 6 chars → Tampil error "Password minimal 6 karakter"
- ❌ Password tidak cocok → Tampil error "Password tidak cocok"

---

### Test 1.2: User Login

**Steps:**

1. Buka `http://localhost:3000/dashboard/login`
2. Isi username: "johndoe", password: "password123"
3. Klik "Login"

**Expected Result:**

- ✅ Redirect ke `/dashboard`
- ✅ localStorage memiliki:
  - `access_token`: JWT token
  - `user`: {"id": "...", "username": "johndoe", "role": "user", "name": "John Doe", "email": "john@example.com"}
- ✅ Dashboard menampilkan user greeting

**Failure Scenarios:**

- ❌ Username salah → Error: "Username atau password salah"
- ❌ Password salah → Error: "Username atau password salah"
- ❌ Akun tidak terdaftar → Error: "Username atau password salah"

---

### Test 1.3: Admin Login

**Steps:**

1. Buka `http://localhost:3000/admin/login`
2. Isi username: "admin", password: "admin123"
3. Klik "Login"

**Expected Result:**

- ✅ Redirect ke `/admin/dashboard`
- ✅ localStorage memiliki:
  - `admin_access_token`: JWT token
  - `admin_user`: {"id": "...", "username": "admin", "role": "admin"}
- ✅ Admin dashboard tampil dengan stats cards

**Failure Scenarios:**

- ❌ Role bukan "admin" → Error pada login atau redirect ke dashboard
- ❌ Token tidak valid → Redirect ke `/admin/login` di halaman protected

---

## Test Suite 2: User Submission Forms

### Test 2.1: Submit KTP Application

**Steps:**

1. Login sebagai user "johndoe"
2. Buka dashboard, klik "KTP" → "Ajukan Permohonan"
3. Isi form (23 fields):
   - Personal: NIK, Nama, Tempat lahir, Tanggal lahir, Jenis kelamin
   - Address: Alamat, RT/RW, Kelurahan, Kecamatan, Kabupaten, Provinsi
   - Details: Agama, Status perkawinan, Pekerjaan
   - Type: Jenis pengajuan
   - Upload: Dokumen KK, Akta lahir (required, PDF/JPG)

4. Klik "Ajukan"

**Expected Result:**

- ✅ Form validation passes
- ✅ Documents converted to Base64 (FileReader API)
- ✅ POST ke `/api/id-cards` dengan:
  ```json
  {
    "user_id": "johndoe_id",
    "applicant_name": "John Doe",
    "data": { "nik": "...", "nama_lengkap": "...", ... },
    "documents": { "dokumen_kk": "data:application/pdf;base64,...", ... },
    "status": "pending"
  }
  ```
- ✅ Success screen menampilkan:
  - Checkmark icon
  - ID Pengajuan: "KTP-[first_8_chars_id]"
  - "Pengajuan KTP berhasil dikirim. Silakan cek status pengajuan Anda..."
  - Button "Buat Pengajuan Baru"

**Failure Scenarios:**

- ❌ File size > 5MB → Error: "Ukuran file terlalu besar (max 5MB)"
- ❌ File type tidak valid → Error: "Tipe file tidak didukung"
- ❌ Required field kosong → Error di field tersebut

### Test 2.2: Submit Perkawinan (Marriage) Application

**Steps:**

1. Buka `/dashboard/perkawinan/pengajuan`
2. Isi 26 fields:
   - Groom: NIK, Nama, Tempat lahir, Tanggal lahir, Agama
   - Bride: NIK, Nama, Tempat lahir, Tanggal lahir, Agama
   - Marriage: Tanggal, Tempat, Wali nikah
   - Witnesses: 2x (Nama, NIK)
   - Upload: NIK groom/bride (required), KK keduanya, Akta lahir (optional)

3. Klik "Ajukan"

**Expected Result:**

- ✅ POST ke `/api/marriages`
- ✅ All 26 fields stored in `data` object
- ✅ Success screen with ID

### Test 2.3: Test All 6 Services

Repeat Test 2.1 for:

- Kelahiran (Birth) - 14 fields
- Kematian (Death) - 15 fields
- KK (Family Card) - 10 fields
- Pindah (Move) - 17 fields

**Verify:**

- ✅ Each form submits to correct endpoint
- ✅ All fields stored correctly in data{}
- ✅ Status initialized as "pending"

---

## Test Suite 3: User Submission Dashboard

### Test 3.1: View All Submissions

**Steps:**

1. Login sebagai user (yg sudah submit minimal 3 pengajuan)
2. Buka `/dashboard/submissions`

**Expected Result:**

- ✅ Table menampilkan semua pengajuan user
- ✅ Columns: ID, Jenis Layanan, Tanggal, Status (badge), Aksi (Lihat/Hapus)
- ✅ Submissions sorted by date (terbaru pertama)
- ✅ Status badges menampilkan dengan warna:
  - Pending: Yellow
  - Verifying: Blue
  - Approved: Green
  - Rejected: Red
  - Completed: Gray

### Test 3.2: Filter by Service

**Steps:**

1. Pilih "Jenis Layanan" dropdown
2. Select "KTP"

**Expected Result:**

- ✅ Table hanya menampilkan KTP submissions
- ✅ Service filter tersimpan di URL/state

### Test 3.3: Filter by Status

**Steps:**

1. Pilih "Status" dropdown
2. Select "Menunggu Review"

**Expected Result:**

- ✅ Hanya pending submissions ditampilkan

### Test 3.4: View Submission Detail

**Steps:**

1. Klik "Lihat" pada satu submission
2. Buka `/dashboard/submissions/[service]/[id]`

**Expected Result:**

- ✅ Halaman menampilkan:
  - Submission ID, Service, Applicant, Status badge
  - Created date, Updated date
  - All data fields dari form
  - Document download buttons
  - Rejection reason (jika status=rejected)
- ✅ Documents dapat didownload (Base64 → file)

### Test 3.5: Delete Pending Submission

**Steps:**

1. Pada submission dengan status="pending"
2. Klik tombol "Hapus" (trash icon)
3. Confirm dialog

**Expected Result:**

- ✅ DELETE ke `/api/[service]/[id]`
- ✅ Submission dihapus dari list (soft delete, status="deleted")
- ✅ Not visible di user dashboard anymore

---

## Test Suite 4: Admin Dashboard

### Test 4.1: View Admin Dashboard

**Steps:**

1. Login sebagai admin
2. Buka `/admin/dashboard`

**Expected Result:**

- ✅ Stats cards menampilkan:
  - Total submissions bulan ini
  - Count: Menunggu review, Sedang diverifikasi, Disetujui, Ditolak
- ✅ "Recent Submissions" table menampilkan 10 terbaru
- ✅ Button "Lihat Semua Pengajuan" visible

### Test 4.2: Navigate to Full Submissions

**Steps:**

1. Klik "Lihat Semua Pengajuan"

**Expected Result:**

- ✅ Navigate ke `/admin/submissions`
- ✅ Unified table dari ALL 6 services ditampilkan

---

## Test Suite 5: Admin Submissions Management

### Test 5.1: View All Submissions (Admin)

**Steps:**

1. Buka `/admin/submissions`

**Expected Result:**

- ✅ Table menampilkan:
  - ID (first 8 chars)
  - Service (KTP, Kelahiran, dll)
  - Applicant name
  - Status (badge with color)
  - Date
  - Aksi button
- ✅ Pagination: 20 per page, dengan page numbers
- ✅ Stats cards di atas: Total, Pending, Verifying, Approved, Rejected

### Test 5.2: Filter by Service (Admin)

**Steps:**

1. Dropdown "Jenis Layanan"
2. Select "Kelahiran"

**Expected Result:**

- ✅ Table hanya menampilkan Kelahiran submissions
- ✅ Pagination reset ke page 1

### Test 5.3: Filter by Status

**Steps:**

1. Dropdown "Status"
2. Select "Sedang Diverifikasi"

**Expected Result:**

- ✅ Table hanya menampilkan verifying submissions

### Test 5.4: Sort Submissions

**Steps:**

1. Dropdown "Urutkan Berdasarkan"
2. Try: Tanggal Terbaru, Tanggal Tertua, Nama A-Z, Status

**Expected Result:**

- ✅ Table re-sorts accordingly
- ✅ Pagination resets

### Test 5.5: Search by ID/Name

**Steps:**

1. Input field "Cari ID/Nama"
2. Type "John" (applicant name)

**Expected Result:**

- ✅ Table filtered ke submissions matching "john"
- ✅ Real-time filtering

### Test 5.6: Paginate Results

**Steps:**

1. Buat >= 25 submissions
2. Navigate ke page 2 (klik "2" button)

**Expected Result:**

- ✅ Page 2 shows submissions 21-40
- ✅ Current page highlighted
- ✅ Previous/Next buttons enabled/disabled appropriately

---

## Test Suite 6: Admin Approval Workflow

### Test 6.1: View Submission Detail (Admin)

**Steps:**

1. Klik "Lihat" pada pending submission
2. Buka `/admin/submissions/[service]/[id]`

**Expected Result:**

- ✅ Left panel: Full submission data + documents
- ✅ Right panel: Approval workflow
  - Status badge
  - If pending: "Mulai Verifikasi" button
  - Status timeline (created, verifying, approved/rejected, completed)

### Test 6.2: Send to Verifying

**Steps:**

1. Pending submission detail page
2. Klik "Mulai Verifikasi"

**Expected Result:**

- ✅ PUT ke `/api/[service]/[id]/status` dengan `{status: "verifying"}`
- ✅ Status changed to "verifying" (blue badge)
- ✅ Workflow buttons change:
  - Now shows: "Setujui" (green) dan "Tolak" (red)
  - "Mulai Verifikasi" button disappears
- ✅ Timeline updates: "Diverifikasi" entry added with timestamp

### Test 6.3: Approve Submission

**Steps:**

1. Submission in "verifying" status
2. Klik "Setujui"

**Expected Result:**

- ✅ PUT ke `/api/[service]/[id]/status` dengan `{status: "approved"}`
- ✅ Status changed to "approved" (green badge)
- ✅ Workflow updates:
  - "Setujui" dan "Tolak" buttons disappear
  - Shows "Tandai Selesai" button
  - Timeline: "Disetujui" entry with timestamp
- ✅ User sees status update in `/dashboard/submissions/[id]`

### Test 6.4: Reject with Reason

**Steps:**

1. Submission in "verifying" status
2. Klik "Tolak"
3. Textarea appears
4. Type reason: "Dokumen kurang lengkap"
5. Klik "Kirim Penolakan"

**Expected Result:**

- ✅ PUT ke `/api/[service]/[id]/reject` dengan:
  ```json
  { "rejection_reason": "Dokumen kurang lengkap" }
  ```
- ✅ Status changed to "rejected" (red badge)
- ✅ Rejection reason displayed in red box
- ✅ Timeline: "Ditolak" entry
- ✅ User sees rejection reason in their submission detail
- ✅ User can resubmit (create new submission for same service)

### Test 6.5: Mark as Completed

**Steps:**

1. Submission in "approved" status
2. Klik "Tandai Selesai"

**Expected Result:**

- ✅ PUT ke `/api/[service]/[id]/status` dengan `{status: "completed"}`
- ✅ Status changed to "completed" (gray badge)
- ✅ All workflow buttons disappear
- ✅ Message: "Pengajuan telah selesai"
- ✅ Timeline complete with all entries

### Test 6.6: Invalid Transitions

**Steps:**

1. Try to approve pending submission (skip verifying)
2. Try to mark rejected submission as completed
3. Try invalid state transitions

**Expected Result:**

- ✅ Backend rejects with 400/403 error
- ✅ Frontend shows error: "Transisi status tidak diizinkan"
- ✅ Status tidak berubah

---

## Test Suite 7: User Profile Management

### Test 7.1: View Profile

**Steps:**

1. Login sebagai user
2. Buka `/dashboard/profile`

**Expected Result:**

- ✅ Form menampilkan current user info:
  - Username: (disabled field)
  - Name: "John Doe"
  - Email: "john@example.com"

### Test 7.2: Update Profile

**Steps:**

1. Change Name to "Jane Doe"
2. Change Email to "jane@example.com"
3. Klik "Simpan Perubahan"

**Expected Result:**

- ✅ PUT ke `/api/auth/profile` dengan new name/email
- ✅ Green success: "Profil berhasil diperbarui"
- ✅ `db.json` user entry updated
- ✅ localStorage `user` updated
- ✅ Changes persist on page reload

**Failure Scenarios:**

- ❌ Name kosong → Error: "Nama tidak boleh kosong"
- ❌ Email kosong → Error: "Email tidak boleh kosong"
- ❌ Invalid email → Error: "Email tidak valid"

### Test 7.3: Change Password

**Steps:**

1. Klik "Ubah Password"
2. Isi:
   - Old password: "password123"
   - New password: "newpass456"
   - Confirm: "newpass456"
3. Klik "Ubah Password"

**Expected Result:**

- ✅ PUT ke `/api/auth/change-password` dengan old dan new password
- ✅ Green success: "Password berhasil diubah"
- ✅ Password hashed in db.json
- ✅ Can login dengan password baru

**Failure Scenarios:**

- ❌ Old password salah → Error: "Password lama salah"
- ❌ New password < 6 chars → Error: "Password baru minimal 6 karakter"
- ❌ Confirm tidak cocok → Error: "Password tidak cocok"

### Test 7.4: Logout

**Steps:**

1. Klik "Logout" button

**Expected Result:**

- ✅ Redirect ke `/dashboard/login`
- ✅ localStorage cleared (access_token, user)
- ✅ Cannot access protected pages without login

---

## Test Suite 8: Authorization & Security

### Test 8.1: User Cannot Access Admin Pages

**Steps:**

1. Login sebagai user "johndoe"
2. Try to access `/admin/dashboard` directly

**Expected Result:**

- ✅ Redirect ke `/admin/login`
- ✅ Access denied message atau blank page

### Test 8.2: Admin Cannot Access User Dashboard

**Steps:**

1. Login sebagai admin
2. Try to access `/dashboard`

**Expected Result:**

- ✅ User dashboard rejects admin (check role="user")
- ✅ Redirect ke appropriate page atau error

### Test 8.3: User Sees Only Own Submissions

**Steps:**

1. Login sebagai user1, submit pengajuan
2. Create user2, submit different pengajuan
3. Login as user1, check `/dashboard/submissions`

**Expected Result:**

- ✅ User1 hanya melihat submission-nya sendiri
- ✅ User2 hanya melihat submission-nya sendiri
- ✅ API GET /api/[service] filters by user_id

### Test 8.4: Unauthorized API Calls

**Steps:**

1. Remove access_token from localStorage
2. Try to POST ke `/api/id-cards`

**Expected Result:**

- ✅ 401 Unauthorized response
- ✅ Frontend shows error atau redirects to login

### Test 8.5: User Cannot Approve Submissions

**Steps:**

1. Login sebagai user
2. Try to PUT `/api/[service]/[id]/status` dengan pending submission

**Expected Result:**

- ✅ 401/403 Forbidden error
- ✅ Only admins dapat call status change endpoints

---

## Test Suite 9: Edge Cases & Data Integrity

### Test 9.1: Multiple Submissions Same Service

**Steps:**

1. User submit KTP, then submit another KTP
2. Check `/dashboard/submissions`

**Expected Result:**

- ✅ Both submissions visible
- ✅ Different IDs
- ✅ Can track both separately

### Test 9.2: Large File Upload

**Steps:**

1. Try to upload file 6MB (over 5MB limit)

**Expected Result:**

- ✅ Error: "Ukuran file terlalu besar (max 5MB)"
- ✅ File tidak diupload
- ✅ Form tidak disubmit

### Test 9.3: Rejection & Resubmission

**Steps:**

1. Admin reject submission dengan reason
2. User lihat rejection reason
3. User submit new submission for same service

**Expected Result:**

- ✅ Old submission status = "rejected"
- ✅ New submission status = "pending"
- ✅ Both visible di user dashboard
- ✅ New submission has different ID

### Test 9.4: Concurrent Admin Actions

**Steps:**

1. Open same submission di 2 tabs
2. Tab 1: Approve, Tab 2: Reject

**Expected Result:**

- ✅ First action succeeds
- ✅ Second action fails dengan "Invalid transition" (already approved)

### Test 9.5: Data Persistence

**Steps:**

1. Submit pengajuan
2. Restart backend
3. Check if submission still exists

**Expected Result:**

- ✅ `db.json` persists data
- ✅ All submissions restored on restart
- ✅ No data loss

---

## Test Suite 10: Performance & Load

### Test 10.1: Pagination with Large Dataset

**Steps:**

1. Create 100+ submissions
2. Buka `/admin/submissions`
3. Navigate through pages

**Expected Result:**

- ✅ Page loads quickly (< 2s)
- ✅ Pagination works smoothly
- ✅ No memory leaks

### Test 10.2: Filter Performance

**Steps:**

1. Apply multiple filters quickly
2. Search, sort, change status filter

**Expected Result:**

- ✅ Filters apply responsively
- ✅ No lag or slowdown

### Test 10.3: Document Download

**Steps:**

1. Download Base64 document (PDF, image)

**Expected Result:**

- ✅ File downloads properly
- ✅ File can be opened
- ✅ Content intact (no corruption)

---

## Test Suite 11: Error Handling

### Test 11.1: Backend Down

**Steps:**

1. Stop backend server
2. Try to login or submit form

**Expected Result:**

- ✅ Error message: "Gagal terhubung ke server"
- ✅ No infinite loading
- ✅ Can refresh and retry

### Test 11.2: Network Error

**Steps:**

1. Disconnect internet
2. Submit form

**Expected Result:**

- ✅ Error caught
- ✅ User-friendly message
- ✅ Can retry

### Test 11.3: Invalid JWT Token

**Steps:**

1. Manually edit localStorage access_token (corrupt it)
2. Try to access protected page

**Expected Result:**

- ✅ 401 Unauthorized
- ✅ Redirect to login
- ✅ Token cleared

---

## Test Suite 12: Cross-Browser Testing

Test pada:

- ✅ Chrome/Chromium (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browser (iOS Safari, Chrome Android)

**Verify:**

- Form layouts responsive
- Buttons clickable on mobile
- Pagination works
- Tables scroll horizontally on mobile

---

## Test Summary Checklist

- [ ] User Registration & Login
- [ ] Admin Login
- [ ] All 6 Service Forms (KTP, Kelahiran, Kematian, Perkawinan, KK, Pindah)
- [ ] User Dashboard (Submissions list, filters)
- [ ] User Submission Detail (View, download docs)
- [ ] Admin Dashboard (Stats, recent submissions)
- [ ] Admin Submissions List (Filters, pagination, search, sort)
- [ ] Admin Approval Workflow (pending→verifying→approved→completed)
- [ ] Admin Rejection (with reason)
- [ ] User Profile (Update, change password, logout)
- [ ] Authorization checks (Role-based access)
- [ ] User isolation (Own submissions only)
- [ ] Edge cases (Multiple submissions, file limits, resubmission)
- [ ] Error handling (Network, validation, invalid state)
- [ ] Performance (Large dataset, filtering)
- [ ] Cross-browser compatibility

---

## Known Issues / To Fix

_Add any bugs or issues found during testing here_

---

## Performance Metrics

Record these after testing:

- Page load time: \_\_\_ ms
- Form submission time: \_\_\_ ms
- Pagination load time: \_\_\_ ms
- Document download time: \_\_\_ ms

---

## Sign-off

- Tester: ****\_\_\_****
- Date: ****\_\_\_****
- All tests passed: [ ] Yes [ ] No
- Issues found: [ ] None [ ] See above
