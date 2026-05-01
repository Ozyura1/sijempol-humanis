# Quick Start - OTP & Email Notification

## Instalasi & Setup (5 menit)

### 1. Konfigurasi Email Service

Edit file `backend/.env`:

```env
# Gmail Setup (Recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx  # From Google App Passwords
EMAIL_FROM=noreply@sijempolhumanis.web.id
FRONTEND_URL=http://localhost:3000
```

**Untuk Gmail:**

1. Buka https://myaccount.google.com
2. Go to Security → 2-Step Verification (aktifkan jika belum)
3. Buka https://myaccount.google.com/apppasswords
4. Select Mail & Windows Computer → Generate
5. Copy 16-character password ke `.env`

### 2. Jalankan Backend

```bash
cd backend
node server.js
```

Expected output:

```
✓ Admin user already exists: admin@disdukcapil.go.id
Backend listening at http://localhost:8000
```

### 3. Jalankan Frontend

```bash
npm run dev
```

## Menggunakan Fitur OTP Registration

### User Flow:

1. **Buka** `http://localhost:3000/auth/register`

2. **Stage 1: Enter Details**
   - Nama Lengkap: John Doe
   - Email: john@gmail.com
   - Username: johndoe
   - Klik **"Kirim Kode OTP"**

3. **Check Email**
   - Cek folder inbox (atau spam)
   - Copy 6-digit OTP code
   - Kode berlaku 10 menit

4. **Stage 2: Verify OTP**
   - Paste OTP code
   - Enter Password (min 6 char)
   - Confirm Password
   - Klik **"Verifikasi & Daftar"**

5. **Success!**
   - Redirect ke login page
   - Akun siap digunakan

## Admin Approval Email Notifications

### When Admin Approves:

1. Admin buka dashboard
2. Find submission → Klik **"Approve"**
3. **Automatically:**
   - Status berubah jadi "approved"
   - Email dikirim ke user dengan:
     - ✓ Permohonan Disetujui
     - Jenis layanan & nomor referensi
     - Link ke dashboard

### When Admin Rejects:

1. Find submission → Klik **"Reject"**
2. Input alasan penolakan
3. **Automatically:**
   - Status berubah jadi "rejected"
   - Email dikirim ke user dengan:
     - ⚠ Permohonan Ditolak
     - Alasan penolakan
     - Link untuk resubmit

## Testing dengan Postman

### Test OTP Request:

```
POST http://localhost:8000/api/auth/otp/request-otp

Body (JSON):
{
  "email": "test@gmail.com",
  "username": "testuser",
  "name": "Test User"
}

Response:
{
  "message": "Kode OTP telah dikirim ke email Anda",
  "email": "test@gmail.com",
  "otp_expires_in": 10
}
```

### Test OTP Verify:

```
POST http://localhost:8000/api/auth/otp/verify-otp

Body (JSON):
{
  "email": "test@gmail.com",
  "otp_code": "123456",
  "password": "password123",
  "confirmPassword": "password123"
}

Response:
{
  "message": "Registrasi berhasil!",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@gmail.com",
    ...
  }
}
```

## Common Issues & Solutions

### ❌ "Email not sent"

**Solution:**

- Check `.env` file
- Verify Gmail App Password (not regular password)
- Check 2-Factor Authentication is enabled on Google Account
- Check backend logs for errors

### ❌ "OTP expired"

**Solution:**

- Click "Kirim Ulang" button
- Generate new OTP (valid for 10 minutes)

### ❌ "Wrong OTP code"

**Solution:**

- Check OTP code from email (case sensitive)
- Make sure no extra spaces
- Click "Kirim Ulang" if OTP already expired

### ❌ "Backend won't start"

**Solution:**

```bash
cd backend
npm install  # Make sure dependencies installed
node server.js
```

### ❌ "Frontend can't connect to backend"

**Solution:**

1. Check backend running: `http://localhost:8000`
2. Check `.env` in frontend:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
3. Check CORS settings in `backend/server.js`

## File Locations

```
backend/
├── utils/
│   └── email.js          # Email functions
├── routes/
│   ├── otp.js            # OTP endpoints ✨ NEW
│   ├── resources.js      # Updated with email
│   └── auth.js
├── .env.example          # Updated with email config
├── server.js             # Updated routes
└── db.js                 # Updated with otp_requests

app/auth/
└── register/
    └── page.tsx          # Updated with OTP flow ✨ MAJOR CHANGE

📄 Documentation:
├── OTP_EMAIL_SETUP.md              # Detailed setup guide
├── FEATURE_OTP_EMAIL_SUMMARY.md    # Full feature documentation
└── QUICK_START.md                  # This file
```

## Key Endpoints

| Method | Endpoint                     | Purpose                     |
| ------ | ---------------------------- | --------------------------- |
| POST   | `/api/auth/otp/request-otp`  | Request OTP                 |
| POST   | `/api/auth/otp/verify-otp`   | Verify OTP & register       |
| POST   | `/api/auth/otp/resend-otp`   | Resend OTP                  |
| PUT    | `/api/{resource}/:id/status` | Admin approve (sends email) |
| PUT    | `/api/{resource}/:id/reject` | Admin reject (sends email)  |

## Performance & Security

✅ **Security:**

- 6-digit random OTP
- 10-minute expiration
- One-time use
- Password hashing (bcrypt)
- Auto-cleanup of old OTPs

✅ **Performance:**

- Async email sending
- Non-blocking registration
- Database optimization
- Graceful error handling

✅ **Reliability:**

- Email service fallback
- Error logging
- Retry mechanisms
- Email queuing ready

## Support Resources

📖 **Documentation:**

- `OTP_EMAIL_SETUP.md` - Full setup guide
- `FEATURE_OTP_EMAIL_SUMMARY.md` - Complete feature docs

🔧 **Configuration:**

- Backend: `backend/.env`
- Frontend: `app/.env.local` (if needed)

📊 **Monitoring:**

- Backend logs in terminal
- Check email delivery status
- Admin panel submissions view

---

**Setup time:** ~5-10 minutes
**Testing time:** ~10-15 minutes
**Ready to use:** ✅ Yes!
