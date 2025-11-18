import ActivityChild from "../models/ActivityChild.js";

// orang tua bisa lihat catatan anaknya
// guru bisa lihat catatan anak yang diajar

export const listMine = async (req, res, next) => {
  try {
    const { role, sub: userId, childIDs = [] } = req.user; // gunakan "childIDs" konsisten
    const q = {};

    if (role === "teacher") q.TeacherID = userId;
    else if (role === "parent") q.ChildID = { $in: childIDs };

    // admin: bisa override filter
    if (req.query.ChildID) q.ChildID = req.query.ChildID;

    if (req.query.from || req.query.to) {
      q.Date = {};
      if (req.query.from) q.Date.$gte = new Date(req.query.from);
      if (req.query.to)   q.Date.$lte = new Date(req.query.to);
    }

    const items = await ActivityChild.find(q).sort({ Date: -1 });
    res.json({ data: items });
  } catch (err) {
    next(err);
  }
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

export const list = async (req, res, next) => {
  try {
    const data = await ActivityChild.find()
      .populate("ChildID", "name classId")      // ➜ ambil nama anak + id kelas
      .populate({
        path: "ChildID",
        populate: { path: "classId", select: "name grade" } // ➜ ambil nama kelas
      })
      .populate("TeacherID", "name email")      // ➜ ambil nama guru
      .sort({ createdAt: -1 });

    res.json({ data });
  } catch (e) {
    next(e);
  }
};




export const detail = async (req, res, next) => {
  try {
    const item = await ActivityChild.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "not found" });

    // RBAC
    const { role, sub: userId, childIDs = [] } = req.user;

    if (role === "teacher" && item.TeacherID?.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (role === "parent" && !childIDs.map(String).includes(item.ChildID?.toString())) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ data: item });
  } catch (err) {
    next(err);
  }
};


//membuat catatan aktivitas anak
export const create = async (req, res) => {
  try {
    const {
      ChildID,
      Activity,
      Date,
      TimeStart,
      TimeEnd,
      AdditionalNotes
    } = req.body;

    if (!ChildID || !Activity || !TimeStart || !TimeEnd) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const doc = await ActivityChild.create({
      ChildID,
      Activity,
      TeacherID: req.user.sub,
      Date,
      TimeStart,
      TimeEnd,
      AdditionalNotes
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


//mengubah catatan aktivitas anak
export const update = async (req, res, next) => {
  try {
    const item = await ActivityChild.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Aktivitas tidak ditemukan" });

    const { role, sub: userId } = req.user;
    if (role === "teacher" && item.TeacherID?.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

        const allowedActivities = [
      "Senam Pagi",
      "Kegiatan Bermain",
      "Kegiatan Bercerita",
      "Makan Siang",
      "Jam Pulang"
    ];

    if ("Activity" in req.body && !allowedActivities.includes(req.body.Activity)) {
      return res.status(400).json({ message: "Activity tidak valid" });
    }

    const updatable = ["Activity", "Date", "TimeStart", "TimeEnd", "AdditionalNotes"];
    for (const k of updatable) {
      if (k in req.body) item[k] = k === "Date" ? new Date(req.body[k]) : req.body[k];
    }

    await item.save();
    res.json({ message: "Updated", data: item });
  } catch (err) {
    next(err);
  }
};

//menghapus catatan aktivitas anak

export const remove = async (req, res, next) => {
  try {
    const item = await ActivityChild.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Aktivitas tidak ditemukan" });

    const { role, sub: userId } = req.user;
    if (role === "teacher" && item.TeacherID?.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await item.deleteOne();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

