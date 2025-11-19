#Untuk deploy aja karena susunan directory frontend dan backend di ameliana/edusafe tidak selevel jadi gabisa dideploy
# Aplikasi Website Edusafe

## Deskripsi Aplikasi
Edusafe adalah layanan backend berbasis **Node.js (Express)** dengan **MongoDB (Mongoose)** untuk memfasilitasi komunikasi dan pemantauan aktivitas siswa antara **Admin, Guru, dan Orang Tua**.  
Fitur utama sistem meliputi:
- Autentikasi **JWT**
- Manajemen pengguna & kelas
- Presensi siswa
- Catatan aktivitas harian anak
- Siaran (broadcast)
- Umpan balik orang tua (feedback)
- Notifikasi sistem
- Integrasi cuaca menggunakan **WeatherAPI** dengan **Redis** untuk caching

## Nama Kelompok & Anggota
**Kelompok 6 - Pengembangan Aplikasi Website**
- Ameliana Hardianti Utari (23/513968/TK/56455)
- Muhammad Khaira Rahmadya Nauval (23/521078/TK/57466)
- Muhammad Mulat Adi Wardhana (23/522856/TK/57765)
- Melvino Rizky Putra Wahyudi (23/515981/TK/56770)
- Rozan Gangsar Adibrata (23/521626/TK/57547)

## Struktur Folder & File
```
edusafe/
├── src/
│ ├── controllers/
│ │ ├── ActivityChild.controller.js
│ │ ├── attendance.controller.js
│ │ ├── auth.controller.js
│ │ ├── broadcast.controller.js
│ │ ├── Child.controller.js
│ │ ├── Class.controller.js
│ │ ├── feedback.controller.js
│ │ ├── notification.controller.js
│ │ └── user.controller.js
│ │
│ ├── jobs/
│ │ └── weatherNotifier.js
│ │
│ ├── lib/
│ │ └── redis.js
│ │
│ ├── middlewares/
│ │ ├── authMiddleware.js
│ │ └── cache.js
│ │
│ ├── models/
│ │ ├── ActivityChild.js
│ │ ├── Attendance.js
│ │ ├── Broadcast.js
│ │ ├── Child.js
│ │ ├── Class.js
│ │ ├── Feedback.js
│ │ ├── SystemNotification.js
│ │ └── User.js
│ │
│ ├── routes/
│ │ ├── ActivityChild.routes.js
│ │ ├── attendance.routes.js
│ │ ├── auth.js
│ │ ├── broadcast.routes.js
│ │ ├── Child.routes.js
│ │ ├── Class.routes.js
│ │ ├── feedback.routes.js
│ │ ├── notifications.routes.js
│ │ ├── users.js
│ │ └── weather.routes.js
│ │
│ ├── services/
│ │ └── weather.service.js
│ │
│ └── server.js
│
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Teknologi yang Digunakan  
- **Node.js + Express** — framework backend  
- **MongoDB + Mongoose** — database & ODM  
- **JWT** — autentikasi  
- **Redis** — caching  
- **WeatherAPI** — integrasi data cuaca 

## URL Laporan
https://drive.google.com/drive/folders/1uBPdrFWQ9Cn4EAWuQxt27FGU5IRjE_ew?usp=sharing

## URL Video
https://drive.google.com/drive/folders/1oFcvjKK7inzrQ5yO1nRs2SnSsSTpLwqZ?usp=sharing
