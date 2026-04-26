# Quick Start Guide - Fixed Backend & Frontend

## Starting the Application

### 1. Start Backend Server

```bash
cd backend
npm install  # if not already done
npm start
# Server runs on http://localhost:8000
# Check: curl http://localhost:8000/
```

### 2. Start Frontend

```bash
# In root directory or app directory
npm run dev
# Frontend runs on http://localhost:3000
```

### 3. Default Admin Credentials

```
Username: admin
Password: admin123
```

---

## Testing the Fixed Features

### Test 1: User Registration & Login

```bash
# Register new user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "name": "Test User",
    "email": "test@example.com"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# Response:
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {...}
}
```

### Test 2: Token Refresh

```bash
# Use the refresh_token from login response
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJhbGc..."
  }'

# Returns new access_token and refresh_token
```

### Test 3: Create Submission

```bash
curl -X POST http://localhost:8000/api/id-cards \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "applicant_name": "John Doe",
    "data": {
      "nik": "1234567890123456",
      "nama": "John Doe"
    },
    "documents": {}
  }'
```

### Test 4: Pagination

```bash
# Get first 20 submissions
curl -X GET "http://localhost:8000/api/id-cards?page=1&limit=20" \
  -H "Authorization: Bearer ACCESS_TOKEN"

# Response includes pagination metadata
{
  "data": [...submissions],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "totalPages": 8
  }
}
```

### Test 5: Admin Actions

```bash
# Login as admin first (username: admin, password: admin123)

# Change submission status
curl -X PUT http://localhost:8000/api/id-cards/1/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"new_status": "verifying"}'

# Reject submission
curl -X PUT http://localhost:8000/api/id-cards/1/reject \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rejection_reason": "Data tidak lengkap"}'
```

### Test 6: Logout & Token Invalidation

```bash
# Logout
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer ACCESS_TOKEN"

# Try using same token (should fail)
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer ACCESS_TOKEN"
# Returns: 401 - Token has been invalidated
```

---

## Frontend Testing

### User Flow

1. Go to `http://localhost:3000`
2. Click "Login" or "Register"
3. Register new account or login with existing credentials
4. Navigate to dashboard
5. Submit service application (KTP, Birth Certificate, etc.)
6. View submissions in "Submissions" page
7. Logout (should clear all tokens)

### Admin Flow

1. Go to `http://localhost:3000/admin/login`
2. Login with: admin / admin123
3. View dashboard with submission stats
4. Click "View All Submissions"
5. Filter by service and status
6. Click on submission to view details
7. Change status or reject submission
8. Logout

---

## Verification Checklist

After starting the application:

- [ ] Frontend loads at `http://localhost:3000`
- [ ] Backend API responds at `http://localhost:8000/api`
- [ ] User registration works
- [ ] User login returns access_token and refresh_token
- [ ] Token refresh creates new tokens
- [ ] Admin login checks user role
- [ ] Admin dashboard loads with stats
- [ ] Can submit service applications
- [ ] Submissions list shows with pagination
- [ ] Admin can view all submissions
- [ ] Admin can change submission status
- [ ] Logout clears tokens
- [ ] Pages redirect to login when not authenticated

---

## Common Issues & Fixes

### Issue: 403 Forbidden on submission creation

**Fix**: Ensure user is logged in and has `role: "user"`

### Issue: 401 Unauthorized on admin endpoints

**Fix**:

1. Login to admin account first
2. Check token is valid: `Bearer TOKEN` format
3. Verify user role is "admin"

### Issue: Submissions not loading

**Fix**:

1. Check pagination response structure: `{ data: [], pagination: {...} }`
2. Frontend should extract `data` array from response
3. Check console for API errors

### Issue: CORS error when submitting

**Fix**:

1. Ensure frontend URL is in CORS whitelist
2. Check that credentials are being sent: `credentials: 'include'`
3. Restart backend after CORS config changes

### Issue: Token expired but not refreshing

**Fix**:

1. Check if refresh_token is stored correctly
2. Frontend should call `refreshAccessToken()` automatically
3. Verify `/api/auth/refresh` endpoint is accessible

---

## Database Inspection

### View all users

```bash
# Connect to database file
cat backend/data/database.json | jq '.users'
```

### View submissions for a service

```bash
cat backend/data/database.json | jq '.id_cards'
```

### Clear test data (WARNING: Deletes everything)

```bash
rm backend/data/database.json
# Restart backend to regenerate with admin user only
```

---

## API Endpoints Reference

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns tokens)
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout (blacklist token)

### Services (KTP, Birth, Death, Marriage, Move, Family Card)

- `GET /api/{service}` - List submissions (user sees own, admin sees all)
- `GET /api/{service}/:id` - Get single submission
- `POST /api/{service}` - Create submission (user only)
- `PUT /api/{service}/:id` - Update submission (user only, pending status only)
- `DELETE /api/{service}/:id` - Delete submission (user only, pending status only)
- `PUT /api/{service}/:id/status` - Change status (admin only)
- `PUT /api/{service}/:id/reject` - Reject submission (admin only)

### Query Parameters

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `status` - Filter by status (pending, verifying, approved, rejected, completed, deleted)

---

## Performance Tips

1. **Pagination**: Always use pagination for admin views

   ```
   /api/id-cards?page=1&limit=20  ✓ Good
   /api/id-cards                   ✗ Slow (returns all)
   ```

2. **Token Refresh**: Frontend automatically refreshes before token expires
   - Access token: 1 hour
   - Refresh token: 7 days
   - Let the context handle refresh, don't call manually

3. **Caching**: Don't cache submissions between page navigation
   - Always refetch to ensure latest data
   - Use React Query or SWR for advanced caching

4. **Large Submissions**: Consider file size limits
   - Base64 documents increase JSON size
   - Future: Move to S3/filesystem storage

---

**Last Updated**: April 26, 2026
**Fixes Implemented**: 20+ critical issues resolved
**Status**: ✅ All systems operational
