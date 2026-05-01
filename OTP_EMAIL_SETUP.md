# Setup OTP dan Email Notification

Fitur OTP untuk registrasi dan email notification telah ditambahkan ke SiJempol Humanis. Panduan setup berikut menjelaskan cara mengkonfigurasi email service.

## Requirements

- Backend Node.js sudah terinstall
- Akun email (Gmail, Outlook, Yahoo, dll)
- Environment variables sudah dikonfigurasi

## Instalasi Package

Package `nodemailer` sudah terinstall di backend. Jika belum, jalankan:

```bash
cd backend
npm install nodemailer
```

## Konfigurasi Email Service

### Option 1: Gmail (Recommended)

1. **Aktifkan 2-Factor Authentication:**
   - Buka https://myaccount.google.com
   - Masuk dengan akun Gmail Anda
   - Navigasi ke "Security" (Keamanan)
   - Aktifkan "2-Step Verification" (Verifikasi 2 Langkah)

2. **Generate App Password:**
   - Buka https://myaccount.google.com/apppasswords
   - Pilih "Mail" dan "Windows Computer" (atau perangkat Anda)
   - Klik "Generate"
   - Copy app password yang ditampilkan

3. **Update .env file di backend:**

```env
# Email Configuration (untuk OTP dan notifikasi)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_APP_PASSWORD=your-app-password
EMAIL_FROM=noreply@sijempolhumanis.web.id
FRONTEND_URL=http://localhost:3000
```

### Option 2: Outlook/Hotmail

```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=your-email@outlook.com
FRONTEND_URL=http://localhost:3000
```

### Option 3: Yahoo Mail

```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=your-email@yahoo.com
FRONTEND_URL=http://localhost:3000
```

## Fitur OTP untuk Registrasi

### Flow Registrasi dengan OTP:

1. **User membuka halaman registrasi** → `/auth/register`

2. **Stage 1: Request OTP**
   - User input: Nama, Email, Username
   - Sistem mengirim kode OTP ke email user
   - Kode OTP berlaku selama **10 menit**

3. **Stage 2: Verify OTP**
   - User input: Kode OTP, Password, Konfirmasi Password
   - Sistem verify kode OTP
   - Akun user terbuat dan verified

### API Endpoints:

#### Request OTP

```
POST /api/auth/otp/request-otp

Body:
{
  "email": "user@example.com",
  "username": "myusername",
  "name": "John Doe"
}

Response (201):
{
  "message": "Kode OTP telah dikirim ke email Anda",
  "email": "user@example.com",
  "otp_expires_in": 10
}
```

#### Verify OTP

```
POST /api/auth/otp/verify-otp

Body:
{
  "email": "user@example.com",
  "otp_code": "123456",
  "password": "password123",
  "confirmPassword": "password123"
}

Response (201):
{
  "message": "Registrasi berhasil!",
  "user": {
    "id": 1,
    "username": "myusername",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

#### Resend OTP

```
POST /api/auth/otp/resend-otp

Body:
{
  "email": "user@example.com"
}

Response (200):
{
  "message": "Kode OTP baru telah dikirim ke email Anda",
  "email": "user@example.com",
  "otp_expires_in": 10
}
```

## Email Notifikasi untuk Approval

Ketika admin menerima (approve) atau menolak permohonan layanan, sistem akan secara otomatis mengirim email ke user.

### Email Approval Notification

Dikirim ketika admin approve submission dengan pesan:

- ✓ Permohonan Disetujui
- Jenis Layanan
- Nomor Referensi
- Tanggal Persetujuan
- Link ke dashboard untuk melihat detail

### Email Rejection Notification

Dikirim ketika admin reject submission dengan pesan:

- ⚠ Permohonan Ditolak
- Jenis Layanan
- Nomor Referensi
- Alasan Penolakan
- Link untuk submit ulang

## Database Schema

### Tabel: otp_requests

Menyimpan temporary OTP requests untuk registrasi:

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "myusername",
  "name": "John Doe",
  "otp_code": "123456",
  "otp_expires_at": "2024-01-01T10:10:00Z",
  "created_at": "2024-01-01T10:00:00Z"
}
```

### Update: users table

Tambahan field untuk tracking:

- `is_verified`: boolean (true jika email sudah verified melalui OTP)

## Testing

### Manual Testing Registrasi OTP:

1. Buka `http://localhost:3000/auth/register`

2. Isi form dengan:
   - Nama: John Doe
   - Email: your-email@gmail.com
   - Username: johndoe

3. Klik "Kirim Kode OTP"

4. Check email Anda (cek folder spam jika tidak terlihat)

5. Copy kode OTP dari email

6. Kembali ke halaman registrasi

7. Paste kode OTP

8. Isi password dan konfirmasi

9. Klik "Verifikasi & Daftar"

10. Redirect ke login page dengan message "Registered successfully"

### Testing Email Notification:

1. Login sebagai admin

2. Buka admin dashboard

3. Find submission yang status "verifying"

4. Approve atau reject submission

5. Check email user untuk notification

## Troubleshooting

### Email tidak terkirim?

**Untuk Gmail:**

- Pastikan 2-Factor Authentication sudah aktif
- Pastikan App Password benar (bukan password regular)
- Cek apakah akun Google memblock akses "Less secure apps"
- Cek apakah email sudah di-recover di `https://accounts.google.com/signin/recovery`

**General:**

- Check backend logs untuk error messages
- Pastikan `.env` file sudah correct
- Test koneksi SMTP dengan tool seperti `telnet` atau `curl`

### OTP Expired?

User bisa klik "Kirim Ulang" untuk generate OTP baru. OTP lama akan di-invalidate.

### Email masuk spam?

Tambahkan email sender ke contact atau whitelist di email client Anda.

## Best Practices

1. **Jangan share email credentials** - Gunakan app-specific password bukan main password
2. **Rotate credentials regularly** - Ubah app password setiap 3 bulan
3. **Monitor email usage** - Check admin panel untuk email statistics
4. **Keep backend secure** - Jangan expose `.env` di public
5. **Test email templates** - Pastikan email terlihat baik di berbagai email clients

## Advanced Configuration

### Menggunakan Environment File yang berbeda

Buat file `.env.production` untuk production:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=production-email@gmail.com
EMAIL_APP_PASSWORD=your-production-app-password
EMAIL_FROM=noreply@sijempolhumanis.web.id
FRONTEND_URL=https://sijempolhumanis.web.id
NODE_ENV=production
```

Jalankan server dengan:

```bash
NODE_ENV=production node server.js
```

### Custom Email Templates

Edit file `backend/utils/email.js` untuk customize email templates HTML.

Sections yang bisa dikustomisasi:

- Email subject
- HTML template
- Email styling
- Call-to-action buttons

## Support

Untuk pertanyaan atau issue dengan email/OTP setup, silakan buat issue di repository atau hubungi tim development.
