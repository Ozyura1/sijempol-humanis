# SiJempol Humanis Backend

Backend baru ini dirancang untuk dijalankan terpisah dari frontend Next.js. Ia menyediakan endpoint RESTful kompatibel dengan struktur API yang diperlukan oleh frontend.

## Instruksi cepat

1. Buka terminal dan masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Install dependency:
   ```bash
   npm install
   ```
3. Copy file contoh env:
   ```bash
   copy .env.example .env
   ```
4. Jalankan server:
   ```bash
   npm run dev
   ```

Server akan berjalan di `http://localhost:8000` secara default.

## Endpoint penting

- `POST /api/auth/login`
- `POST /api/auth/otp/request-otp`
- `POST /api/auth/otp/verify-otp`
- `POST /api/auth/otp/resend-otp`
- `GET /api/auth/profile`
- `GET /api/agendas`
- `POST /api/aspirasis`
- `GET /api/aspirasis` (butuh token)
- `GET /api/id-cards`
- `POST /api/id-cards`
- `GET /api/id-cards/:id`
- `PUT /api/id-cards/:id`
- `DELETE /api/id-cards/:id`

## Catatan hosting

- Untuk hosting, gunakan layanan Node.js seperti Vercel (Serverless Functions), Railway, Render, Fly.io, atau DigitalOcean App Platform.
- Pastikan `PORT` disesuaikan dengan environment hosting.
- Jika ingin frontend tetap menggunakan `localhost:8000/api` saat development, set `NEXT_PUBLIC_API_URL=http://localhost:8000/api` di file `.env.local` Next.js.
- Untuk deployment, ganti `NEXT_PUBLIC_API_URL` jadi URL backend yang sebenarnya.
