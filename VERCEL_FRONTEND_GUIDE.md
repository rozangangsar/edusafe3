# EduSafe Frontend - Vercel Deployment Guide

Complete guide untuk deploy Next.js frontend ke Vercel.

## Prerequisites

- GitHub repository `edusafe3` sudah punya monorepo structure (apps/backend + apps/frontend)
- Vercel account (free tier sudah cukup)
- GitHub connected dengan Vercel

---

## Step 1: Login ke Vercel

1. Buka https://vercel.com
2. Click **Sign Up** atau **Log In**
3. Pilih **Continue with GitHub**
4. Authorize Vercel untuk access GitHub repositories

---

## Step 2: Import Repository

### Method A: Dari Vercel Dashboard

1. Click **Add New Project**
2. Click **Continue with GitHub**
3. Di field "Search your GitHub repositories", ketik: `edusafe3`
4. Klik repository `edusafe3`
5. Click **Import**

### Method B: Direct Link

Atau bisa direct ke:
```
https://vercel.com/new/git/external?repository-url=https://github.com/YOUR_USERNAME/edusafe3
```

---

## Step 3: Configure Project

### Important Settings:

**Root Directory:**
```
✅ MUST: apps/frontend
❌ DON'T: frontend atau root directory
```

**Framework Preset:**
```
✅ Should auto-detect: Next.js 16
```

**Build Command:**
```
Default: npm run build
(Usually auto-detected correctly)
```

**Output Directory:**
```
Default: .next
(Auto-detected, don't change)
```

**Install Command:**
```
Default: npm install
(Or: npm ci)
```

---

## Step 4: Environment Variables

Di halaman "Configure your Project", scroll ke bawah ke **Environment Variables**.

### Add Variable:

**For Development/Staging:**
```
Name:  NEXT_PUBLIC_API_BASE_URL
Value: http://localhost:4000
```

**For Production (After Backend Deploy):**
```
Name:  NEXT_PUBLIC_API_BASE_URL
Value: https://your-backend-api-url.com
       (e.g., https://edusafe-api.railway.app)
```

**Note:**
- Kalo backend belum deploy, boleh pakai `http://localhost:4000` dulu
- Nanti update setelah backend ready
- Environment variable harus di-prefix dengan `NEXT_PUBLIC_` agar accessible di client-side

---

## Step 5: Deploy

1. Verify semua settings sudah benar
2. Click **Deploy**
3. Wait 3-5 menit untuk build & deployment complete

---

## Step 6: Verify Deployment

### Check Build Logs:
1. Di Vercel dashboard, click project
2. Click **Deployments** tab
3. Check latest deployment status
4. Click untuk lihat build logs

### Visit Live URL:
```
https://edusafe3.vercel.app
(atau custom domain kalo sudah setup)
```

### Test Frontend:
1. Coba navigate ke halaman yang berbeda
2. Check Console (F12) untuk error
3. Check Network tab untuk API calls

---

## Common Issues & Solutions

### Issue 1: Build Fails with "Cannot find module"
**Solution:**
- Check `apps/frontend/package.json` dependencies semua installed
- Run locally: `npm run build` di `apps/frontend`
- Check imports path (relative paths harus correct)

### Issue 2: API Calls Return 404
**Solution:**
- Check `NEXT_PUBLIC_API_BASE_URL` env var di Vercel
- Ensure backend URL accessible dari browser
- Check CORS settings di backend

### Issue 3: Susense Boundary Error
**Solution:**
- Should sudah fixed (sudah kita fix sebelumnya dengan Suspense wrapper)
- Verify semua `useSearchParams()` di-wrap dengan Suspense
- Check updated files:
  - `apps/frontend/app/(dashboard)/admin/daftarkelas/informasikelas/page.js`
  - `apps/frontend/app/(dashboard)/admin/daftarkelas/informasikelas/inputsiswa/page.js`
  - `apps/frontend/app/(dashboard)/editteacher/page.js`
  - `apps/frontend/app/(dashboard)/editparent/page.js`

### Issue 4: Next.js Build Error
**Solution:**
- Check `next.config.mjs` at `apps/frontend/`
- Verify all required plugins installed
- Try local build: `cd apps/frontend && npm run build`

### Issue 5: Deployment Stuck on "Building"
**Solution:**
- Wait up to 10 minutes
- Check build logs for errors
- If still stuck, cancel dan retry
- Check Vercel system status (vercel.com/status)

---

## After Successful Deployment

### 1. Update Environment Variables When Backend Ready

```
1. Get backend URL after deploy (e.g., https://api.railway.app)
2. Vercel Dashboard → Settings → Environment Variables
3. Update: NEXT_PUBLIC_API_BASE_URL = https://api.railway.app
4. Auto-redeploy should trigger
```

### 2. Setup Custom Domain (Optional)

```
1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records (instructions provided by Vercel)
```

### 3. Monitor Deployments

```
1. Vercel Dashboard → Deployments
2. See all previous deployments
3. Can rollback jika ada issue
```

### 4. Setup Automatic Deployments

```
By default, Vercel auto-deploy:
- Push ke main branch → auto-deploy
- Pull requests → preview deploy (preview-url)
```

---

## Frontend URL Structure

After deployment, struktur URL:

```
https://edusafe3.vercel.app                    (landing)
https://edusafe3.vercel.app/login              (login)
https://edusafe3.vercel.app/admin              (admin dashboard)
https://edusafe3.vercel.app/admin/daftarkelas (list classes)
https://edusafe3.vercel.app/admin/users        (user management)
```

---

## Next Steps

1. ✅ Frontend deployed ke Vercel
2. 🔲 Deploy backend ke Railway/Render/Heroku
3. 🔲 Update `NEXT_PUBLIC_API_BASE_URL` dengan backend URL
4. 🔲 Test end-to-end integration
5. 🔲 Setup custom domain (optional)

---

## Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Project URL: https://vercel.com/dashboard/project/edusafe3
- Frontend URL: https://edusafe3.vercel.app
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
