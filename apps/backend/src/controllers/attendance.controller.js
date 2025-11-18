import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import { cacheDelPrefix } from "../middlewares/cache.js";
import Class from "../models/Class.js";
import Child from "../models/Child.js";



/** Helper: normalisasi ke awal hari (UTC) untuk konsistensi unik harian */
function normalizeDateToUTCStart(d) {
  const x = new Date(d || Date.now());
  return new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate()));
}

/** Helper: awal & akhir pekan (Senin-Minggu) dalam UTC */
function getWeekRange(startDate) {
  const d = normalizeDateToUTCStart(startDate || new Date());
  const dow = d.getUTCDay() || 7; // 1..7, Senin=1
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - (dow - 1));
  const nextMonday = new Date(monday);
  nextMonday.setUTCDate(monday.getUTCDate() + 7);
  return { start: monday, end: nextMonday };
}

/** Create attendance (check-in/initial) */
export const create = async (req, res, next) => {
  try {
    const { childID, date = new Date(), status = "hadir", checkIn } = req.body;
    if (!childID) return res.status(400).json({ msg: "childID required" });

    const normalized = normalizeDateToUTCStart(date);
    const teacherID = req.user?.sub || req.user?._id || req.user?.id;

    let checkInTime = status === "hadir" ? (checkIn ? new Date(checkIn) : new Date()) : undefined;
    
    // Validasi jam check-in (7-8 pagi)
    if (checkInTime && status === "hadir") {
      const hour = checkInTime.getHours();
      if (hour < 7 || hour >= 8) {
        return res.status(400).json({ 
          msg: "Check-in hanya diperbolehkan antara jam 7:00 - 8:00 pagi" 
        });
      }
    }

    const doc = await Attendance.create({
      childID: new mongoose.Types.ObjectId(childID),
      date: normalized,
      status,
      checkIn: checkInTime,
      teacherID,
    });
    await cacheDelPrefix(`/api/attendance/recap/weekly/${String(childID)}`);
    res.status(201).json(doc);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ msg: "attendance already exists for this child on that date" });
    }
    next(e);
  }
};

/** Update attendance (checkout/status/note) */
export const update = async (req, res, next) => {
  try {
    const patch = { ...req.body };
    if (patch.date) patch.date = normalizeDateToUTCStart(patch.date);
    const row = await Attendance.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!row) return res.status(404).json({ msg: "not found" });
    res.json(row);
  } catch (e) { next(e); }
};

/** Checkout manual */
export const checkout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await Attendance.findById(id);
    
    if (!row) return res.status(404).json({ msg: "Attendance not found" });
    if (row.checkOut) return res.status(400).json({ msg: "Already checked out" });
    if (!row.checkIn) return res.status(400).json({ msg: "Cannot checkout without check-in" });

    // Set checkout time (variasi antara 15:00-16:00)
    const now = new Date();
    const checkOutVariations = [15, 15.5, 16]; // jam 3, 3:30, 4 sore
    const randomCheckout = checkOutVariations[Math.floor(Math.random() * checkOutVariations.length)];
    
    const checkoutTime = new Date(now);
    checkoutTime.setHours(Math.floor(randomCheckout));
    checkoutTime.setMinutes((randomCheckout % 1) * 60);
    checkoutTime.setSeconds(0);
    
    row.checkOut = checkoutTime;
    await row.save();
    
    res.json(row);
  } catch (e) { 
    next(e); 
  }
};

/** List attendance per child */
export const listByChild = async (req, res, next) => {
  try {
    const { role, sub: userId } = req.user || {};
    const { childId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ msg: "Invalid childId" });
    }

    // orang tua hanya boleh lihat anaknya sendiri - cek dari database
    if (role === "parent") {
      const child = await Child.findById(childId).select("parentID").lean();
      if (!child) {
        return res.status(404).json({ msg: "Child not found" });
      }
      // Cek apakah child ini milik parent yang sedang login
      if (String(child.parentID) !== String(userId)) {
        return res.status(403).json({ msg: "forbidden" });
      }
    }
    
    const rows = await Attendance.find({ childID: childId })
      .sort({ date: -1 })
      .populate("childID", "name")
      .populate("teacherID", "name")
      .lean();
    res.json(rows);
  } catch (e) { next(e); }
};

/** Weekly recap per child: counts by status + daily rows */
export const recapWeekly = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { start } = req.query;
    // izin akses parent
    const { role, childIDs = [] } = req.user || {};
    if (role === "parent" && !childIDs.map(String).includes(String(childId))) {
      return res.status(403).json({ msg: "forbidden" });
    }

    const { start: startWeek, end: endWeek } = getWeekRange(start ? new Date(start) : new Date());

    const match = { 
      childID: new mongoose.Types.ObjectId(childId),
      date: { $gte: startWeek, $lt: endWeek }
    };

    const counts = await Attendance.aggregate([
      { $match: match },
      { $group: { _id: "$status", c: { $sum: 1 } } }
    ]);

    const map = { hadir:0, sakit:0, izin:0, alfa:0 };
    counts.forEach(x => { map[x._id] = x.c; });

    const days = await Attendance.find(match).sort({ date: 1 }).lean();

    res.json({
      childId,
      range: { start: startWeek, end: endWeek },
      total: days.length,
      ...map,
      days
    });
  } catch (e) { next(e); }
};


export const listAll = async (req, res, next) => {
  try {
    const rows = await Attendance.find()
      .populate("childID", "name")
      .populate("teacherID", "name")
      .sort({ date: -1 });

    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const listForTeacher = async (req, res, next) => {
  try {
    const teacherId = req.user.sub;
    console.log("🧑‍🏫 Teacher ID:", teacherId);

    // cari kelas yang dia ampu
    const classes = await Class.find({
      homeroomTeacherIDs: teacherId
    }).lean();

    console.log("📚 Classes found for teacher:", classes.length);
    console.log("Classes:", classes.map(c => ({ id: c._id, name: c.name })));

    if (!classes.length) {
      console.log("⚠️ Teacher tidak punya kelas, return empty");
      return res.json([]); // teacher belum punya kelas
    }

    // ambil anak dari kelas tsb
    const childIds = await Child.find({
      classID: { $in: classes.map(c => c._id) }
    }).distinct("_id");

    console.log("👶 Children IDs in teacher's classes:", childIds.length);

    // ambil attendance anak
    const rows = await Attendance.find({
      childID: { $in: childIds }
    })
      .populate("childID", "name")
      .populate("teacherID", "name")
      .sort({ date: -1 });

    console.log("📋 Attendance records found:", rows.length);
    res.json(rows);
  } catch (e) {
    console.error("❌ Error in listForTeacher:", e);
    next(e);
  }
};

