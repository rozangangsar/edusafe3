import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import { authMiddleware, roleRequired } from "./middlewares/authMiddleware.js";
import ActivityChildRoute from "./routes/ActivityChild.routes.js";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import ChildRoutes from './routes/Child.routes.js';
import attendanceRoute from './routes/attendance.routes.js';
import BroadcastRoute from './routes/broadcast.routes.js';
import FeedbackRoute from './routes/feedback.routes.js';
import WeatherRoute from "./routes/weather.routes.js";
import NotificationsRoute from "./routes/notifications.routes.js";
import { startWeatherNotifier } from "./jobs/weatherNotifier.js";
import Class from "./models/Class.js";
import ClassRoute from "./routes/Class.route.js";


dotenv.config();
const api = express();

// middleware
api.use(express.json());
api.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://edusafe2.vercel.app"
  ],
  credentials: true
}));
api.use(cookieParser());
api.use(morgan("dev"));


//user route
api.use("/api/users", usersRoute);

//Child route
api.use('/api/children', ChildRoutes);

//Class route
api.use('/api/classes', ClassRoute);

//Child attendance route
api.use('/api/attendance', attendanceRoute);

//Broadcast route
api.use('/api/broadcasts', BroadcastRoute);

//Feedback route
api.use('/api/feedbacks', FeedbackRoute);

//Weather route
api.use('/api/weather', WeatherRoute);

//Notifications route
api.use('/api/notifications', NotificationsRoute);

// test route
api.get("/", (req, res) => res.json({ msg: "API jalan bro" }));

// routes
api.use("/api/auth", authRoute);
api.use("/api/activitychild", ActivityChildRoute);

// cek yang butuh login
api.get("/api/private", authMiddleware, (req, res) => {
  res.json({ msg: "ini halaman private bro" });
});

// cek yang butuh role tertentu
api.get("/api/teacher-only", authMiddleware, roleRequired("teacher"), (req, res) => {
  res.json({ msg: "ini halaman guru doang bro" });
});
api.get("/api/admin-only", authMiddleware, roleRequired("admin"), (req, res) => {
  res.json({ msg: "ini halaman admin doang bro" });
});
api.get("/api/parent-only", authMiddleware, roleRequired("parent"), (req, res) => {
  res.json({ msg: "ini halaman orang tua doang bro" });
});

api.use("/api/users", usersRoute);

// weather notifier job
const LAT = parseFloat(process.env.SCHOOL_LAT);
const LON = parseFloat(process.env.SCHOOL_LON);

startWeatherNotifier({
  lat: LAT,
  lon: LON,
  hour: Number(process.env.WEATHER_CHECK_HOUR || 9),
  minute: Number(process.env.WEATHER_CHECK_MINUTE || 0),
});

// connect db

(async () => {
  try {
    console.log(' Connecting to MongoDB...');
    console.log(' MONGO_URI:', process.env.MONGO_URI ? ' Set' : ' NOT SET');
    
    // Test connection dengan timeout lebih panjang
    const startTime = Date.now();
    console.log('⏳ Attempting connection...');
    
    await mongoose.connect(process.env.MONGO_URI, { 
      dbName: "edusafe",
      serverSelectionTimeoutMS: 60000, // 60 seconds (lebih lama lagi)
      socketTimeoutMS: 45000,
      connectTimeoutMS: 60000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    
    const connectionTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(" Mongo connected ->", mongoose.connection.name);
    console.log(" MongoDB ready! (took " + connectionTime + "s)");
    console.log(" Database:", mongoose.connection.db.databaseName);

    api.listen(process.env.PORT, () => {
      console.log("");
      console.log(" ========================================");
      console.log(" API running on port " + process.env.PORT);
      console.log(" Test API: http://localhost:" + process.env.PORT);
      console.log(" Health check: http://localhost:" + process.env.PORT + "/");
      console.log(" ========================================");
      console.log("");
    });
  } catch (err) {
    console.error();
    console.error(" ========================================");
    console.error(" Mongo connect error:", err.name);
    console.error(" Message:", err.message);
    console.error(" ========================================");
    
    // Berikan saran berdasarkan error
    if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error(" Saran: Cek koneksi internet atau DNS");
      console.error("   Coba ping: ping paw.mdfrkop.mongodb.net");
    } else if (err.message.includes('authentication failed') || err.message.includes('bad auth')) {
      console.error(" Saran: Cek username/password MongoDB");
      console.error("  Username: amelianahardiantiutari_db_user");
    } else if (err.message.includes('timeout') || err.message.includes('serverSelectionTimeoutMS')) {
      console.error(" Saran: IP mungkin belum aktif di MongoDB Atlas");
      console.error("   1. Tunggu 2-3 menit setelah add IP");
      console.error("   2. Cek MongoDB Atlas -> Network Access");
      console.error("   3. Pastikan IP Anda ada di list");
      console.error("   4. Atau gunakan 0.0.0.0/0 untuk allow all");
    }
    
    console.error("");
    process.exit(1);
  }
})();