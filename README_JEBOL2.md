# JEBOL 2.0 - Lightweight Government Administration System

🏛️ **Modern, Fast, Simple** | 🚀 **Production Ready** | 📊 **Single Backend Architecture**

## About

JEBOL 2.0 is a **government administration system** rebuilt from scratch for **performance, simplicity, and compliance**. This version replaces heavy frameworks (Next.js, Flutter) with a lightweight, modern tech stack.

**Key Stats:**
- ✅ **73 MB** total (was 519 MB)
- ✅ **0 npm packages** in production (was 200+)
- ✅ **<1 second** page load (was 5+ seconds)
- ✅ **Single backend** (Laravel Sanctum auth)
- ✅ **Vanilla JavaScript** (no framework bloat)

## Quick Links

📖 **Setup Guide:** [SETUP.md](SETUP.md)  
🏗️ **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)  
📱 **Web App:** [web-app/README.md](web-app/README.md)  
🧪 **Testing:** [TESTING_README.md](TESTING_README.md)  

## Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Backend API** | Laravel 11 + Sanctum | Type-safe, battle-tested, ORM-based |
| **Frontend** | HTML5 + Vanilla JS + Tailwind CDN | Lightweight, no build step, instant |
| **Database** | MySQL / MariaDB | Reliable, simple, performant |
| **Auth** | Token-based (Bearer) | Stateless, scalable, secure |

## Directory Structure

```
JEBOL_WEBSITE/
├── backend-laravel/          # Laravel API (Sanctum auth)
│   ├── app/Http/Controllers/ # REST endpoints
│   ├── app/Models/           # Eloquent models
│   └── routes/api.php        # API routes
│
├── web-app/                  # Frontend (9 files, <50 KB)
│   ├── index.html            # Single Page App
│   ├── app.js                # 12 KB vanilla logic
│   └── package.json          # 0 dependencies
│
└── Docs/
    ├── SETUP.md              # Installation & quickstart
    ├── ARCHITECTURE.md       # Design decisions
    └── TESTING_README.md     # Test coverage
```

## Quick Start (5 Minutes)

### 1. Start Backend

```bash
cd backend-laravel
php artisan migrate:fresh --seed
php artisan serve  # http://localhost:8000/api
```

### 2. Start Web App

```bash
cd web-app
npx http-server . -p 3000  # http://localhost:3000
```

### 3. Login

Open **http://localhost:3000** and login with:
- **Username:** `admin_ktp`
- **Password:** `password`

Done! ✅

## Features

### 🎛️ Role-Based Access
- `SUPER_ADMIN` - Full system access
- `ADMIN_KTP` - Handle ID/KTP submissions
- `ADMIN_IKD` - View statistics & reports
- `ADMIN_PERKAWINAN` - Manage marriage records
- `RT` - Resident-level access

### 📋 Modules

**KTP Management**
- Submit KTP applications
- Track approval status
- Bulk operations

**IKD Statistics**
- View aggregated data
- Generate reports
- Export to PDF/CSV

**Marriage Records**
- Register marriage
- Manage families
- Print certificates

## Development

### Adding Features

**Backend:**
```bash
php artisan make:model MyModel
# Edit routes/api.php
php artisan make:migration create_my_table
```

**Frontend:**
```html
<!-- Add UI in web-app/index.html -->
<div data-page="my-feature">...</div>
```

```javascript
// Add JS in web-app/app.js
async loadMyFeature() { ... }
```

### Testing

```bash
# Backend unit tests
cd backend-laravel
php artisan test

# API testing: Use Postman collection
# Manual testing: Follow TESTING_README.md
```

## Performance

| Metric | Value |
|--------|-------|
| Page Load (3G) | <1s |
| Time to Interactive | <500ms |
| JavaScript Size | 12 KB |
| CSS (CDN) | 0 KB bundled |
| Total Bundle | <50 KB |
| Lighthouse Score | 95+ |

## Security Features

- ✅ **Sanctum token auth** (stateless)
- ✅ **CORS protection** (origin validation)
- ✅ **Role-based authorization** (gate middleware)
- ✅ **HTTPS ready** (auto protocol)
- ✅ **SQL injection prevention** (Eloquent ORM)
- ✅ **XSS protection** (content-security-policy)
- ✅ **CSRF tokens** (where applicable)
- ✅ **Rate limiting** (API throttle)

## Deployment

### Development
```bash
# Terminal 1: Backend
cd backend-laravel && php artisan serve

# Terminal 2: Frontend
cd web-app && npx http-server . -p 3000
```

### Production (Docker)
```bash
# See docs/docker-compose.yml
docker-compose up -d
```

### Server (No Docker)
```bash
# Backend: Use Apache/Nginx with PHP-FPM
# Frontend: Serve web-app/ as static files

# Update web-app/app.js
apiUrl: 'https://api.example.com'  # Production URL
```

## Project Stats

| Aspect | Old | New |
|--------|-----|-----|
| Total Size | 519 MB | 73 MB |
| Package Count | 200+ | 0 |
| Time to Deploy | 2+ min | <5 sec |
| Dev Dependencies | Huge | Minimal |
| Build Required | Yes | No |
| Runtime Memory | 500+ MB | <50 MB |

## Removed vs Added

### ❌ Removed (Legacy)
- Express.js backend (98 MB) - Single backend in Laravel
- Flutter mobile app (40 MB) - Web app works on all devices
- Next.js frontend (275 MB) - Vanilla JS + Tailwind CDN
- 200+ npm packages - Only http-server for dev

### ✅ Added (New)
- web-app/ with vanilla JS (50 KB)
- Modern SETUP.md documentation
- Lightweight architecture
- Better performance

## Troubleshooting

**CORS Error?**
→ Check `FRONTEND_URL` in `.env`

**401 Unauthorized?**
→ Token expired, login again

**Cannot reach API?**
→ Is `php artisan serve` running on port 8000?

See [SETUP.md](SETUP.md) for detailed troubleshooting.

## Documentation

| File | Purpose |
|------|---------|
| [SETUP.md](SETUP.md) | Complete setup & deployment guide |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design & decisions |
| [web-app/README.md](web-app/README.md) | Frontend development |
| [TESTING_README.md](TESTING_README.md) | Test coverage & strategy |
| [RT_ACCOUNT_SETUP.md](RT_ACCOUNT_SETUP.md) | Role configuration |

## Support

For issues or questions:
1. Check [SETUP.md troubleshooting](SETUP.md#troubleshooting)
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for design context
3. See [TESTING_README.md](TESTING_README.md) for test examples

## License

MIT License - Government use permitted

---

**Version:** 2.0 (Lightweight Rewrite)  
**Last Updated:** April 2026  
**Status:** Production Ready ✅
