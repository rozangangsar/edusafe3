# EduSafe - Deployment Repository Setup

Dokumentasi untuk setup repository baru untuk deployment tanpa mengubah repo utama.

## Step-by-Step Guide

### Prerequisite
- GitHub account pribadi (bukan yang punya repo utama)
- Git installed dan configured

### Step 1: Create New Repository di GitHub Personal Account

1. Buka https://github.com/new
2. **Repository name**: `edusafe-deploy`
3. **Description**: "EduSafe Deployment Repository"
4. **Visibility**: Private (recommended) atau Public
5. **DO NOT check** "Initialize this repository with..."
6. Click **Create repository**

**Catat URL repo baru kamu**, contoh:
```
https://github.com/YOUR_USERNAME/edusafe-deploy.git
```

---

### Step 2: Setup Git Remotes (Lokal)

```bash
# Navigate ke project directory
cd C:\Users\ROZAN\source\repos\edusafe

# Add new remote untuk deploy
git remote add deploy https://github.com/YOUR_USERNAME/edusafe-deploy.git

# Verify semua remotes
git remote -v
```

**Expected output:**
```
origin  https://github.com/Amelianahardianti/edusafe.git (fetch)
origin  https://github.com/Amelianahardianti/edusafe.git (push)
deploy  https://github.com/YOUR_USERNAME/edusafe-deploy.git (fetch)
deploy  https://github.com/YOUR_USERNAME/edusafe-deploy.git (push)
```

---

### Step 3: Push ke Repository Deployment

**Option A: Push langsung (recommended jika main branch sudah clean)**

```bash
git push deploy main
```

**Option B: Push dari branch baru (jika main branch punya history yang tidak ingin dipush)**

```bash
# Create branch baru untuk deployment
git checkout -b deploy-ready

# Push dengan rename branch di remote
git push deploy deploy-ready:main
```

---

### Step 4: Verify di GitHub

1. Buka https://github.com/YOUR_USERNAME/edusafe-deploy
2. Check apakah files sudah ada:
   - ✅ apps/ folder (backend & frontend)
   - ✅ package.json
   - ✅ turbo.json
   - ✅ vercel.json
   - ✅ .gitignore

---

## Setelah ini: Deploy ke Vercel

1. Login ke https://vercel.com
2. New Project
3. Import dari GitHub → pilih `edusafe-deploy` repo
4. Configure:
   - **Root Directory**: `apps/frontend`
   - **Framework**: Next.js
5. Deploy ✅

---

## Important Notes

### Local Workflow (tetap work di repo utama)

Kamu masih bisa:
- Pull dari `origin` (repo utama temen)
- Push ke `origin` untuk contribute ke project utama
- Push ke `deploy` hanya untuk deployment

```bash
# Pull dari repo utama
git pull origin main

# Push contribution ke repo utama
git push origin feature-branch

# Push untuk deployment (hanya ketika siap)
git push deploy main
```

### Jika perlu update deployment repo dengan changes terbaru dari origin

```bash
# Pull latest changes dari origin
git pull origin main

# Push ke deployment repo
git push deploy main
```

---

## Troubleshooting

**Q: Git push error "remote rejected"**
```
A: Pastikan:
1. Authentication token/SSH key sudah setup di GitHub
2. Repository di GitHub sudah created (empty)
3. URL remote sudah benar
```

**Q: Ingin remove remote deploy**
```bash
git remote remove deploy
```

**Q: Lihat semua commits yang akan dipush**
```bash
git log origin..deploy
```

---

## Summary

Struktur remote kamu:
- `origin` → Repo utama temen (Amelianahardianti/edusafe)
- `deploy` → Repo pribadi kamu (YOUR_USERNAME/edusafe-deploy)

✅ Separation of concerns
✅ History di repo utama tetap clean
✅ Deployment bisa dilakukan independent
✅ Easy to sync dengan repo utama
