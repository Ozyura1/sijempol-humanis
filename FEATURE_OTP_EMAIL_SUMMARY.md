# OTP & Email Notification Feature - Implementation Summary

## ✅ Fitur yang Telah Diimplementasikan

Fitur OTP untuk registrasi dan email notifikasi telah berhasil ditambahkan ke sistem SiJempol Humanis.

### 1. **OTP Registration Flow**

#### Registrasi 2-Stage dengan OTP:

**Stage 1: Request OTP**

- User mengisi: Nama Lengkap, Email, Username
- Sistem generate 6-digit OTP random
- OTP dikirim ke email user via email service
- Kode OTP berlaku selama **10 menit**

**Stage 2: Verify OTP & Set Password**

- User input kode OTP yang diterima
- User set password (min 6 karakter)
- Sistem verify OTP
- Jika valid, akun user dibuat dengan status `is_verified: true`
- User langsung bisa login tanpa proses approval email terpisah

### 2. **Email Service Integration**

#### Backend Implementation

- **Package:** `nodemailer` (sudah terinstall)
- **File:** `backend/utils/email.js`
- **Functions:**
  - `generateOTP()` - Generate 6-digit random OTP
  - `sendOTPEmail()` - Kirim OTP ke email user
  - `sendApprovalEmail()` - Notifikasi permohonan disetujui
  - `sendRejectionEmail()` - Notifikasi permohonan ditolak

#### Email Templates:

- OTP Registration Email
  - Kode OTP yang besar dan jelas
  - Pesan instruksi
  - Durasi berlaku (10 menit)
- Approval Notification Email
  - ✓ Permohonan Disetujui
  - Info submission (jenis, nomor ref, tanggal)
  - Link ke dashboard
- Rejection Notification Email
  - ⚠ Permohonan Ditolak
  - Alasan penolakan
  - Link untuk resubmit

### 3. **Backend Endpoints**

#### OTP Routes (`/api/auth/otp`)

**POST /request-otp**

```javascript
Body: {
  (email, username, name);
}
Response: {
  (message, email, otp_expires_in);
}
```

Mengirim OTP ke email user

**POST /verify-otp**

```javascript
Body: {
  (email, otp_code, password, confirmPassword);
}
Response: {
  (message, user);
}
```

Verify OTP dan complete registrasi

**POST /resend-otp**

```javascript
Body: {
  email;
}
Response: {
  (message, email, otp_expires_in);
}
```

Resend OTP baru

### 4. **Frontend Updates**

#### Register Page (`app/auth/register/page.tsx`)

**Improvements:**

- 2-stage registration flow UI
- Stage 1: Request OTP dengan field name, email, username
- Stage 2: Verify OTP dengan input OTP code, password, confirm password
- Real-time countdown timer untuk OTP expiration
- "Kirim Ulang" button untuk request OTP baru
- "Kembali" button untuk kembali ke stage 1
- Visual feedback untuk setiap stage
- Error handling yang user-friendly

**Components Used:**

- Clock icon dari `lucide-react` untuk timer
- Input component untuk OTP code (max 6 chars, centered)
- PasswordInput untuk password fields
- Button dengan loading state

### 5. **Admin Approval Email Notifications**

Ketika admin approve/reject submission:

**Approval Flow:**

1. Admin view submission dengan status "verifying"
2. Admin klik "Approve" → status berubah ke "approved"
3. Sistem otomatis kirim email ke user
4. User dapat melihat submission detail di dashboard

**Rejection Flow:**

1. Admin klik "Reject" → input alasan penolakan
2. Status berubah ke "rejected"
3. Email dengan alasan penolakan dikirim ke user

**Integration Point:**

- `backend/routes/resources.js` - Status change dan reject endpoints
- Auto-email dikirim tanpa perlu manual action

### 6. **Database Schema Updates**

#### New Collection: otp_requests

```javascript
{
  id: 1,
  email: "user@example.com",
  username: "myusername",
  name: "John Doe",
  otp_code: "123456",
  otp_expires_at: "2024-01-01T10:10:00Z",
  created_at: "2024-01-01T10:00:00Z"
}
```

#### Updated users table

- Added: `is_verified: boolean`

## 📁 Files Created/Modified

### New Files Created:

1. **`backend/utils/email.js`** - Email utility functions
2. **`backend/routes/otp.js`** - OTP endpoints
3. **`OTP_EMAIL_SETUP.md`** - Setup documentation

### Files Modified:

1. **`backend/db.js`**
   - Added `otp_requests` collection to defaultData

2. **`backend/server.js`**
   - Import `otpRoutes`
   - Register `/api/auth/otp` routes

3. **`app/auth/register/page.tsx`**
   - Complete rewrite with 2-stage OTP flow
   - Added state management untuk stage, timer
   - New UI components dan error handling

4. **`backend/routes/resources.js`**
   - Import email functions
   - Updated status change endpoint untuk send approval email
   - Updated reject endpoint untuk send rejection email

5. **`backend/.env.example`**
   - Added EMAIL\_\* variables dengan dokumentasi

## 🔧 Environment Configuration

Required `.env` variables di backend:

```env
# Email Service (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
EMAIL_FROM=noreply@sijempolhumanis.web.id

# Frontend URL untuk email links
FRONTEND_URL=http://localhost:3000
```

### Setup untuk Gmail:

1. Enable 2-Factor Authentication
2. Generate App Password dari https://myaccount.google.com/apppasswords
3. Copy app password ke `EMAIL_APP_PASSWORD`

## 🚀 Cara Menggunakan

### User Registration dengan OTP:

1. Buka `http://localhost:3000/auth/register`
2. Isi: Nama, Email, Username
3. Klik "Kirim Kode OTP"
4. Check email, copy kode OTP
5. Paste OTP, isi password, klik "Verifikasi & Daftar"
6. Redirect ke login page

### Admin Approval Notifications:

1. User submit permohonan
2. Admin review dan klik "Approve" atau "Reject"
3. Email otomatis dikirim ke user
4. User dapat lihat status di dashboard

## ✨ Key Features

### Security:

- ✅ OTP 6-digit random
- ✅ OTP expiration 10 minutes
- ✅ Password hashing dengan bcrypt
- ✅ Single-use OTP (auto-delete setelah verify)
- ✅ Old OTP auto-cleanup

### UX:

- ✅ Real-time countdown timer
- ✅ Resend OTP button
- ✅ Back button untuk ubah email
- ✅ Clear error messages
- ✅ Loading states
- ✅ Email confirmation message

### Reliability:

- ✅ Email service error handling
- ✅ Graceful fallback jika email gagal
- ✅ Retry mechanisms
- ✅ Logging untuk debugging
- ✅ Database transactions

## 📊 API Flow Diagram

### Registration Flow:

```
User Form
    ↓
1. POST /api/auth/otp/request-otp
    ↓ Generate OTP
    ↓ Store in DB
    ↓ Send Email
    ↓ Display OTP Input Form
    ↓
2. POST /api/auth/otp/verify-otp
    ↓ Verify OTP
    ↓ Create User
    ↓ Clean OTP Record
    ↓ Redirect to Login
```

### Approval Notification Flow:

```
Admin Dashboard
    ↓
PUT /api/{resource}/:id/status (approve)
    ↓ Update Status
    ↓ Find User Email
    ↓ Send Approval Email
    ↓ Return Updated Record
    ↓
User Email Notified
```

## 🧪 Testing Checklist

- [ ] Register dengan OTP - verify email diterima
- [ ] OTP timer countdown bekerja
- [ ] Resend OTP berfungsi
- [ ] OTP expiration 10 menit bekerja
- [ ] Wrong OTP code di-reject
- [ ] Password validation berfungsi
- [ ] Admin approve → email notifikasi terkirim
- [ ] Admin reject → email notifikasi + alasan terkirim
- [ ] Multiple user registration berjalan
- [ ] Email masuk folder spam tidak

## 🐛 Troubleshooting

### Email tidak terkirim?

- Cek `.env` file sudah correct
- Pastikan `nodemailer` sudah terinstall
- Check backend logs untuk error messages
- Test Gmail App Password di https://myaccount.google.com/apppasswords

### OTP tidak diterima?

- Check email spam folder
- Verify email address benar
- Check backend service status

### Frontend tidak connect ke backend?

- Verify `NEXT_PUBLIC_API_URL` benar
- Check backend server berjalan di port 8000
- Verify CORS configuration

## 📝 Notes

- OTP code disimpan di database temporary
- OTP otomatis di-delete setelah 1 jam jika tidak digunakan
- Email templates bisa dikustomisasi di `backend/utils/email.js`
- Sistem support multiple email services (Gmail, Outlook, Yahoo, dll)
- Email notifications juga bisa di-extend untuk case lain di masa depan

## 🔄 Next Steps (Optional Enhancements)

1. **SMS OTP Option** - Add Twilio untuk SMS OTP
2. **Email Verification Template** - Custom branding
3. **OTP Rate Limiting** - Prevent brute force
4. **Audit Log** - Track OTP attempts
5. **Bulk Email** - Queue system untuk many emails
6. **Email Preview** - Admin dapat preview email sebelum send
7. **Schedule Email** - Send email di waktu tertentu

## 📞 Support

Untuk pertanyaan atau issues:

1. Check log di backend console
2. Baca `OTP_EMAIL_SETUP.md` untuk setup details
3. Check `.env` configuration
4. Test API endpoints menggunakan Postman
