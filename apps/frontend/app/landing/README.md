# Struktur Folder Landing Page Lengkap

## 📁 Struktur Lengkap

```
app/landing/
├── components/              # ✅ Components untuk landing page
│   ├── Navbar.js          # Navigation bar dengan logo & menu
│   ├── Hero.js            # Hero section dengan CTA
│   ├── Features.js         # Features section dengan grid
│   ├── Stats.js           # Statistics section
│   ├── CTA.js             # Call-to-action section
│   ├── Footer.js          # Footer dengan links
│   └── index.js           # Export semua components
│
├── sections/               # 📦 Section components (untuk section kompleks)
│   └── .gitkeep          # Placeholder untuk section baru
│
├── data/                   # 📊 Data & constants
│   └── landingData.js     # Features, stats, navLinks, footerLinks
│
├── styles/                 # 🎨 Styles & constants
│   └── constants.js       # Colors, spacing, typography
│
├── utils/                  # 🔧 Utility functions
│   ├── animations.js      # Framer Motion animation variants
│   └── helpers.js         # Helper functions (scroll, format, dll)
│
├── index.js                # 📦 Main export (import semua dari sini)
└── README.md              # 📖 Dokumentasi
```

## 🎯 Cara Pakai

### Import dari landing folder:
```js
// Import semua dari landing
import { 
  Navbar, Hero, Features, Stats, CTA, Footer,
  features, stats,
  fadeInUp, scaleIn,
  scrollToSection,
  colors, spacing
} from './landing';

// Atau import spesifik
import { Navbar, Hero } from './landing/components';
import { features } from './landing/data/landingData';
```

### Di page.js:
```js
import { features, stats } from './landing/data/landingData';
import { Navbar, Hero, Features, Stats, CTA, Footer } from './landing/components';
```

## 📝 Penjelasan Folder

- **components/**: Semua React components untuk landing page
- **sections/**: Section components yang lebih kompleks (Testimonials, Pricing, dll)
- **data/**: Data constants (features, stats, links, dll)
- **styles/**: Style constants (colors, spacing, typography)
- **utils/**: Utility functions (animations, helpers)

## 🚀 Next Steps

1. ✅ Tambahkan gambar ke `public/assets/images/`
2. ✅ Tambahkan SVG ke `public/assets/svg/`
3. ✅ Buat section baru di `sections/` jika perlu
4. ✅ Customize styles di `styles/constants.js`
5. ✅ Tambahkan animation variants di `utils/animations.js`
