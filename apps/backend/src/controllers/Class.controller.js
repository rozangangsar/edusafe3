// src/controllers/Class.controller.js
import mongoose from "mongoose";
import Class from "../models/Class.js";
import User from "../models/User.js";

const isObjectId = (v) => mongoose.Types.ObjectId.isValid(v);

// POST /classes  (admin)
export const create = async (req, res, next) => {
  try {
    const { name, grade, schoolYear, homeroomTeacherIDs = [] } = req.body;
    if (!name || grade == null || !schoolYear) {
      return res.status(400).json({ msg: "name, grade, schoolYear are required" });
    }
    // validasi teacher ids (kalau ada)
    if (!Array.isArray(homeroomTeacherIDs)) {
      return res.status(400).json({ msg: "homeroomTeacherIDs must be an array" });
    }
    for (const id of homeroomTeacherIDs) {
      if (!isObjectId(id)) return res.status(400).json({ msg: "homeroomTeacherIDs contains invalid id" });
      const t = await User.findById(id).select("role");
      if (!t || t.role !== "teacher") {
        return res.status(400).json({ msg: "homeroomTeacherIDs must contain valid teacher users" });
      }
    }

    const cls = await Class.create({
      name: String(name).trim(),
      grade: Number(grade),
      schoolYear: String(schoolYear).trim(),
      homeroomTeacherIDs
    });
    const populated = await Class.findById(cls._id)
      .populate("homeroomTeacherIDs", "name email");
    res.status(201).json(populated);
  } catch (e) {
    if (e.code === 11000) {
      // kena unique index: (schoolYear, homeroomTeacherIDs)
      return res.status(409).json({ msg: "Conflict: a teacher is already homeroom in this schoolYear" });
    }
    next(e);
  }
};

// GET /classes  (admin, teacher)
// query: ?page=&limit=&schoolYear=&grade=
export const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, schoolYear, grade } = req.query;
    const q = {};
    if (schoolYear) q.schoolYear = String(schoolYear).trim();
    if (grade != null && grade !== "") q.grade = Number(grade);

    // kalau teacher, filter hanya kelas yang dia wali
    if (req.user.role === "teacher") {
      q.homeroomTeacherIDs = { $in: [req.user.sub] };
    }

    const rows = await Class.find(q)
      .sort({ grade: 1, name: 1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate("homeroomTeacherIDs", "name email")
      .lean();

    res.json({ page: +page, limit: +limit, count: rows.length, data: rows });
  } catch (e) { next(e); }
};

// GET /classes/:id  (admin, teacher wali kelas)
export const detail = async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) return res.status(400).json({ msg: "id invalid" });
    const cls = await Class.findById(req.params.id)
      .populate("homeroomTeacherIDs", "name email");
    if (!cls) return res.status(404).json({ msg: "not found" });

    if (req.user.role === "teacher") {
      const isHomeroom = (cls.homeroomTeacherIDs || [])
        .some(id => String(id) === String(req.user.sub));
      if (!isHomeroom) return res.status(403).json({ msg: "forbidden" });
    }

    res.json(cls);
  } catch (e) { next(e); }
};

// PATCH /classes/:id  (admin)
export const update = async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) return res.status(400).json({ msg: "id invalid" });
    const allowed = ["name", "grade", "schoolYear"];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];

    if ("name" in update) update.name = String(update.name).trim();
    if ("grade" in update) update.grade = Number(update.grade);
    if ("schoolYear" in update) update.schoolYear = String(update.schoolYear).trim();

    let cls = await Class.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate("homeroomTeacherIDs", "name email");
    if (!cls) return res.status(404).json({ msg: "not found" });
    res.json(cls);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ msg: "Conflict: unique constraint (schoolYear, teacher) violated" });
    }
    next(e);
  }
};

// DELETE /classes/:id  (admin)
export const remove = async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) return res.status(400).json({ msg: "id invalid" });
    const row = await Class.findByIdAndDelete(req.params.id);
    if (!row) return res.status(404).json({ msg: "not found" });
    res.status(204).end();
  } catch (e) { next(e); }
};

// POST /classes/:id/homeroom  (admin)  body: { teacherId }
export const addHomeroom = async (req, res, next) => {
  try {
    const { teacherId } = req.body;
    if (!isObjectId(req.params.id) || !isObjectId(teacherId)) {
      return res.status(400).json({ msg: "id/teacherId invalid" });
    }
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ msg: "class not found" });

    const t = await User.findById(teacherId).select("role");
    if (!t || t.role !== "teacher") {
      return res.status(400).json({ msg: "teacherId must be a valid teacher user" });
    }

    await Class.updateOne(
      { _id: req.params.id },
      { $addToSet: { homeroomTeacherIDs: teacherId } }
    );

    const dup = await Class.findOne({
      _id: { $ne: req.params.id },
      schoolYear: cls.schoolYear,
      homeroomTeacherIDs: { $in: [teacherId] }
    }).select("_id");
    if (dup) {
      await Class.updateOne(
        { _id: req.params.id },
        { $pull: { homeroomTeacherIDs: teacherId } }
      );
      return res.status(409).json({ msg: "Guru ini sudah jadi wali di kelas lain pada tahun ajaran yang sama" });
    }

    const updated = await Class.findById(req.params.id)
      .populate("homeroomTeacherIDs", "name email");
    res.json(updated);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ msg: "Conflict: guru sudah jadi wali di schoolYear ini" });
    }
    next(e);
  }
};

// DELETE /classes/:id/homeroom/:teacherId  (admin)
export const removeHomeroom = async (req, res, next) => {
  try {
    const { id, teacherId } = req.params;
    if (!isObjectId(id) || !isObjectId(teacherId)) {
      return res.status(400).json({ msg: "id/teacherId invalid" });
    }
    await Class.updateOne(
      { _id: id },
      { $pull: { homeroomTeacherIDs: teacherId } }
    );
    res.status(204).end();
  } catch (e) { next(e); }
};
