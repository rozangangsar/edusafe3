# EduSafe Backend - Railway Deployment Guide

Complete guide untuk deploy Node.js backend ke Railway.app

---

## Prerequisites

- GitHub account (sudah connected dengan Railway)
- `edusafe3` repository di GitHub
- Backend environment variables dari `.env`

---

## Step 1: Create Railway Account

1. Go to: https://railway.app
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Railway untuk access GitHub

---

## Step 2: Create New Project

1. Di Railway dashboard, click **New Project**
2. Click **Deploy from GitHub repo**
3. Di search box, ketik: `edusafe3`
4. Select repository: `rozangangsar/edusafe3`
5. Click **Deploy Now**

Railway akan mulai auto-detect dan deploy.

---

## Step 3: Configure Deploy Settings

Setelah Railway mulai deploy:

1. Click pada project yang sedang di-deploy
2. Click **Settings** tab
3. Look for **"Root Directory"** atau **"Service Path"**
4. Set ke: `apps/backend`

(Railway mungkin auto-detect, tapi verify untuk safe)

---

## Step 4: Add Environment Variables

Di Railway dashboard:

1. Click **Variables** tab
2. Click **Add Variable** untuk setiap var di bawah:

### Required Variables:

```
PORT = 4000
```

```
MONGO_URI = mongodb+srv://amelianahardiantiutari_db_user:KOcYoFp8yT5wnMkQ@paw.mdfrkop.mongodb.net/edusafe?retryWrites=true&w=majority&appName=paw
```

```
JWT_SECRET = DIISIAPAYABRAY
```

```
REDIS_URL = redis://default:5xdYlsdNtnIzj00rtZb7tWdgCIlKN1a3@redis-10365.crce185.ap-seast-1-1.ec2.cloud.redislabs.com:10365
```

```
DEFAULT_CACHE_TTL = 300
```

### Optional Variables (Weather Features):

```
WEATHERAPI_KEY = d2ed3ac229db428bab5173412251509
SCHOOL_LAT = -7.765223139059618
SCHOOL_LON = 110.37252330743343
WEATHER_CHECK_HOUR = 9
WEATHER_CHECK_MINUTE = 0
```

**Note:** Pastikan `NODE_ENV` tidak di-set ke `development`. Railway auto set ke `production`.

---

## Step 5: Verify Deployment

1. Wait 3-5 minutes untuk build & deploy selesai
2. Di Railway dashboard, cek status
3. Look untuk **"Deployment Successful"** message
4. Railway akan give kamu public URL, misal:
   ```
   https://edusafe-api-prod.up.railway.app
   ```

---

## Step 6: Test Backend

### Test dengan cURL atau Postman:

```bash
curl https://your-railway-url/api/auth/me
```

Atau test di Postman:
```
GET https://your-railway-url/api/auth/me
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
```

### Test Login Endpoint:

```bash
curl -X POST https://your-railway-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## Step 7: Update Frontend API URL

Setelah backend di-deploy dan tested:

1. Go to Vercel dashboard
2. Click project: `edusafe3`
3. Click **Settings**
4. Click **Environment Variables**
5. Update `NEXT_PUBLIC_API_BASE_URL`:
   ```
   Name:  NEXT_PUBLIC_API_BASE_URL
   Value: https://your-railway-url
   ```
6. Vercel auto-redeploy dengan new API URL

---

## Useful Railway Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Project Deployments**: Check di railway.app dashboard
- **View Logs**: Click project → **Logs** tab
- **Monitoring**: Click project → **Monitor** tab

---

## Troubleshooting

### Build Failed

**Issue**: Railway build error
**Solution**:
1. Click **Logs** tab untuk lihat error details
2. Check jika semua dependencies ada di `apps/backend/package.json`
3. Try manual build lokal: `cd apps/backend && npm install && npm run build`

### Port Error

**Issue**: Port already in use
**Solution**:
- Railway auto-assign port
- Don't hardcode port, use `process.env.PORT`
- Verify backend code: `const port = process.env.PORT || 4000`

### MongoDB Connection Error

**Issue**: Cannot connect to MongoDB
**Solution**:
1. Verify `MONGO_URI` correct di Railway variables
2. Check MongoDB Atlas: whitelist Railway IP
3. MongoDB Atlas → Network Access → Add IP
4. Or use "0.0.0.0/0" untuk allow semua (less secure)

### Redis Connection Error

**Issue**: Cannot connect to Redis
**Solution**:
1. Verify `REDIS_URL` correct
2. Check Redis provider (Redis Cloud/Upstash)
3. Whitelist Railway IP jika diperlukan

### Frontend Cannot Call Backend

**Issue**: API calls return 404 or CORS error
**Solution**:
1. Verify `NEXT_PUBLIC_API_BASE_URL` di Vercel env vars
2. Check backend CORS config: should allow frontend domain
3. Update `src/server.js`:
   ```javascript
   cors({
     origin: ['https://edusafe3.vercel.app', 'http://localhost:3000'],
     credentials: true
   })
   ```

---

## Important Notes

### Security

⚠️ **WARNING**: `.env` file tidak boleh di-commit ke GitHub!
- Check `.gitignore` sudah ignore `.env`
- Semua sensitive data di Railway **Variables**, bukan di code
- Regenerate JWT_SECRET jika sudah public

### Monitoring

Recommend untuk monitor backend:
- **Railway Logs**: Real-time logs
- **Railway Monitor**: CPU, Memory, Network
- **Error Tracking**: Setup Sentry (optional)

### Scaling

Jika traffic tinggi:
- Railway auto-scales based on usage
- Paid plan lebih bagus dari free tier
- Monitor resource usage di Railway dashboard

---

## Next Steps

1. ✅ Deploy backend ke Railway
2. ✅ Verify API endpoints working
3. ✅ Update frontend API URL di Vercel
4. ✅ Test end-to-end (frontend ↔ backend)
5. 🔲 Setup custom domain (optional)
6. 🔲 Setup monitoring & error tracking (optional)

---

## Summary

```
edusafe3 Repository (GitHub)
    ↓
Frontend (Vercel)  ←→  API calls  ←→  Backend (Railway)
https://edusafe3.vercel.app            https://api-url.railway.app
```

Backend is now live dan siap untuk production!
