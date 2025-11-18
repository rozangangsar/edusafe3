# Assets Folder Structure

## 📁 Struktur Assets

```
frontend/
├── public/
│   └── assets/                  # Static assets (bisa diakses via URL)
│       ├── images/              # Gambar (jpg, png, webp, dll)
│       │   └── .gitkeep
│       └── svg/                 # SVG files
│           └── .gitkeep
│
└── assets/                      # Assets untuk import di code (optional)
    ├── images/
    └── svg/
```

## 🎯 Cara Pakai

### 1. Static Assets (public/assets/)
Untuk gambar/SVG yang bisa diakses langsung via URL atau pakai Next.js Image component:

```js
// Pakai Next.js Image component
import Image from 'next/image';
<Image src="/assets/images/logo.png" alt="Logo" width={100} height={100} />

// Atau langsung pakai img tag
<img src="/assets/images/hero.jpg" alt="Hero" />

// SVG langsung
<img src="/assets/svg/icon.svg" alt="Icon" />
```

### 2. Import Assets (assets/)
Untuk SVG yang mau di-import sebagai React component:

```js
// Import SVG sebagai component (perlu setup SVG loader)
import Logo from '@/assets/svg/logo.svg';
<Logo />
```

## 📝 Rekomendasi

- **Gambar (jpg, png, webp)**: Simpan di `public/assets/images/`
- **SVG untuk icon**: Simpan di `public/assets/svg/`
- **SVG untuk component**: Bisa simpan di `assets/svg/` kalau mau import sebagai React component

## 🔧 Setup SVG sebagai Component (Optional)

Kalau mau import SVG sebagai React component, install:
```bash
npm install @svgr/webpack
```

Lalu update `next.config.mjs` untuk handle SVG imports.

