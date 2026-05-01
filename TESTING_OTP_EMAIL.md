# Testing Guide - OTP & Email Features

## Pre-requisites

1. **Backend running:**

   ```bash
   cd backend
   node server.js
   ```

   Should output: `Backend listening at http://localhost:8000`

2. **Frontend running:**

   ```bash
   npm run dev
   ```

3. **Email service configured in `backend/.env`:**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-app-password
   EMAIL_FROM=noreply@sijempolhumanis.web.id
   ```

## Test Scenario 1: User Registration with OTP

### Step 1: Access Registration Page

- **URL:** `http://localhost:3000/auth/register`
- **Expected:** Sees "Daftar SiJempol" form with fields for Name, Email, Username

### Step 2: Enter User Details

- **Name:** Test User
- **Email:** youremail@gmail.com (must be valid email you own)
- **Username:** testuser123
- **Action:** Click "Kirim Kode OTP" button

**Expected:**

- Page transitions to OTP verification stage
- Message shows: "Kode OTP telah dikirim ke email Anda"
- Timer starts counting down from 10:00

### Step 3: Check Email

- **Check:** Inbox/Spam folder of youremail@gmail.com
- **Look for:** Email from Gmail/Email Service
- **Subject:** "Kode OTP Registrasi SiJempol Humanis"
- **Expected:** Large blue 6-digit OTP code visible in email

### Step 4: Enter OTP

- **Copy:** 6-digit OTP from email
- **Paste:** Into "Kode OTP (6 digit)" field on registration page
- **Expected:** Field accepts exactly 6 characters

### Step 5: Set Password

- **Password:** Test@123456 (min 6 characters)
- **Confirm:** Test@123456
- **Expected:** Fields accept password input

### Step 6: Complete Registration

- **Action:** Click "Verifikasi & Daftar" button
- **Expected:**
  - Loading spinner appears
  - After 2-3 seconds, redirects to login page
  - URL: `http://localhost:3000/auth/login?registered=true`
  - Message: "Registrasi berhasil"

### Step 7: Login with New Account

- **Username:** testuser123
- **Password:** Test@123456
- **Expected:** Login successful, redirects to dashboard

---

## Test Scenario 2: OTP Resend

### Step 1: Request OTP Again

- Go to `http://localhost:3000/auth/register`
- Enter: Test User 2, newemail@gmail.com, testuser456
- Click "Kirim Kode OTP"

### Step 2: Miss First OTP

- Don't look at first email
- Wait 30 seconds

### Step 3: Click Resend

- **Action:** Click "Kirim Ulang" button
- **Expected:**
  - Timer resets to 10:00
  - New OTP sent to email

### Step 4: Verify with New OTP

- **Check email for NEW OTP** (not the first one)
- Enter new OTP
- Complete registration as in Scenario 1

**Expected:** Registration successful with new OTP

---

## Test Scenario 3: OTP Expiration

### Step 1: Request OTP

- Go to `http://localhost:3000/auth/register`
- Enter details
- Click "Kirim Kode OTP"

### Step 2: Wait for Expiration

- **Wait:** 10 minutes for OTP to expire
- **Expected:** Timer reaches 0:00, then disappears

### Step 3: Try Expired OTP

- Enter OTP from first email
- Set password
- Click "Verifikasi & Daftar"

**Expected:** Error message: "Kode OTP telah kadaluarsa. Silakan minta OTP baru."

### Step 4: Resend and Complete

- Click "Kirim Ulang"
- Get new OTP from email
- Complete registration successfully

---

## Test Scenario 4: Invalid OTP

### Step 1: Request OTP

- Go to registration page
- Fill in details
- Click "Kirim Kode OTP"

### Step 2: Enter Wrong OTP

- **Intentionally enter:** Different 6-digit code (not from email)
- Enter password
- Click "Verifikasi & Daftar"

**Expected:** Error message: "Kode OTP tidak valid."

### Step 3: Retry with Correct OTP

- Copy correct OTP from email
- Enter and verify
- **Expected:** Registration successful

---

## Test Scenario 5: Admin Approval Notification

### Step 1: User Submit Request

- Login as regular user
- Navigate to a service (e.g., KTP Request)
- Fill form and submit
- Submission status: "pending"

### Step 2: Admin Reviews

- Logout from user account
- Login as admin: `admin@disdukcapil.go.id`
- Go to Admin Dashboard
- Find the submission
- Status shows: "pending"

### Step 3: Admin Approves

- **Action:** Click "Approve" or similar button
- **Status changes to:** "approved"
- **Expected:**
  - System processes silently
  - Email sent to user's email address
  - Backend log shows email sent (check terminal)

### Step 4: Check User Email

- **Check:** User's email inbox
- **Subject:** "Permohonan [Service] Anda Telah Disetujui - SiJempol Humanis"
- **Content should include:**
  - ✓ Permohonan Disetujui
  - Jenis Layanan: [e.g., Kartu Identitas]
  - Nomor Referensi: #[submission_id]
  - Tanggal Persetujuan: [timestamp]
  - Button: "Lihat Status Permohonan"

---

## Test Scenario 6: Admin Rejection Notification

### Step 1: Submit New Request

- Submit another service request as user

### Step 2: Admin Reviews

- As admin, open the new submission
- Status: "pending"

### Step 3: Admin Rejects

- Click "Reject" button
- Input reason: "Data tidak lengkap. Silakan tambahkan dokumen pendukung."
- Click "Reject" again to confirm

**Expected:**

- Status changes to "rejected"
- Email sent to user

### Step 4: Check User Email

- **Check:** User's email inbox
- **Subject:** "Update Status Permohonan [Service] Anda - SiJempol Humanis"
- **Content should include:**
  - ⚠ Permohonan Ditolak
  - Alasan Penolakan: "Data tidak lengkap..."
  - Jenis Layanan & Nomor Referensi
  - Button: "Kembali ke Dashboard"

---

## Test Scenario 7: Password Validation

### Step 1: Access Registration

- Go to `http://localhost:3000/auth/register`

### Step 2: Test Empty Password

- Fill: Name, Email, Username
- Click "Kirim Kode OTP"
- Enter OTP
- **Leave password empty**
- **Expected:** Error: "Kode OTP, password, dan konfirmasi password wajib diisi"

### Step 3: Test Short Password

- Enter password: "123"
- **Expected:** Error: "Password minimal 6 karakter"

### Step 4: Test Mismatched Password

- Password: "Test123456"
- Confirm: "Test654321"
- **Expected:** Error: "Password dan konfirmasi password tidak cocok"

### Step 5: Test Correct Password

- Password: "Test123456"
- Confirm: "Test123456"
- **Expected:** Registration successful

---

## Test Scenario 8: Duplicate Email/Username

### Step 1: First Registration

- Register: testuser789 / test@example.com

### Step 2: Try Same Email

- Go to registration
- Fill: Different name, Same email (test@example.com), Different username
- Click "Kirim Kode OTP"

**Expected:** Error: "Email sudah terdaftar."

### Step 3: Try Same Username

- Fill: Different name, Different email, Same username (testuser789)
- Click "Kirim Kode OTP"

**Expected:** Error: "Username sudah terdaftar."

---

## API Testing with Postman

### 1. Request OTP

```
POST http://localhost:8000/api/auth/otp/request-otp
Content-Type: application/json

{
  "email": "test@gmail.com",
  "username": "postmantest",
  "name": "Postman User"
}
```

**Expected Response (201):**

```json
{
  "message": "Kode OTP telah dikirim ke email Anda",
  "email": "test@gmail.com",
  "otp_expires_in": 10
}
```

### 2. Verify OTP

```
POST http://localhost:8000/api/auth/otp/verify-otp
Content-Type: application/json

{
  "email": "test@gmail.com",
  "otp_code": "123456",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Expected Response (201):**

```json
{
  "message": "Registrasi berhasil!",
  "user": {
    "id": 1,
    "username": "postmantest",
    "name": "Postman User",
    "email": "test@gmail.com",
    "role": "user",
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

### 3. Resend OTP

```
POST http://localhost:8000/api/auth/otp/resend-otp
Content-Type: application/json

{
  "email": "test@gmail.com"
}
```

**Expected Response (200):**

```json
{
  "message": "Kode OTP baru telah dikirim ke email Anda",
  "email": "test@gmail.com",
  "otp_expires_in": 10
}
```

---

## Debugging Tips

### Check Backend Logs

Watch terminal for messages like:

```
- Error sending OTP email: [error details]
- Sending OTP to: user@example.com
- OTP verified successfully
```

### Check Email Delivery

- Check spam folder
- Check email client logs
- Verify email address is correct

### Check Database

Backend stores OTP in `database.json`:

```json
"otp_requests": [
  {
    "id": 1,
    "email": "user@example.com",
    "otp_code": "123456",
    "otp_expires_at": "2024-01-01T10:10:00Z"
  }
]
```

### Check Frontend

Open browser DevTools (F12) → Console for JavaScript errors

---

## Performance Checklist

- [ ] OTP email arrives within 2-3 seconds
- [ ] Registration completes within 2-3 seconds
- [ ] No backend crashes during testing
- [ ] Timer counts down smoothly
- [ ] Multiple concurrent users can register
- [ ] Email notifications send immediately on approval

---

## Common Test Issues & Solutions

| Issue                              | Solution                                                 |
| ---------------------------------- | -------------------------------------------------------- |
| Email not received                 | Check spam folder, verify .env config                    |
| "Cannot connect to server"         | Check backend is running on port 8000                    |
| OTP invalid but code looks correct | Check for extra spaces, make sure it's from latest email |
| Registration hangs                 | Check backend logs for errors, restart backend           |
| Timer not counting                 | Reload page, check browser console                       |
| Admin approval doesn't send email  | Check email config in .env, check backend logs           |

---

## Final Checklist

- [ ] All 8 scenarios passed
- [ ] API endpoints working in Postman
- [ ] Emails received correctly
- [ ] No errors in backend logs
- [ ] No errors in browser console
- [ ] Timer working properly
- [ ] Database storing data correctly
- [ ] Ready for production!

✅ **If all tests pass, features are ready to use!**
