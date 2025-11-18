// src/controllers/Child.controller.js
import Child from "../models/Child.js";
import User from "../models/User.js";
import Class from "../models/Class.js";

// helper: valid ObjectId
import mongoose from "mongoose";
const isObjectId = (v) => mongoose.Types.ObjectId.isValid(v);

// POST /children (admin, teacher)
export const create = async (req, res, next) => {
  try {
    const { name, birthDate, parentID, classId } = req.body;
    if (!name || !birthDate || !parentID || !classId) {
      return res.status(400).json({ msg: "name, birthDate, parentID, classId are required" });
    }
    if (!isObjectId(parentID) || !isObjectId(classId)) {
      return res.status(400).json({ msg: "parentID/classId invalid" });
    }
    const bdate = new Date(birthDate);
    if (isNaN(bdate.getTime()) || bdate > new Date()) {
      return res.status(400).json({ msg: "birthDate invalid" });
    }

    const parent = await User.findById(parentID).select("role");
    if (!parent || parent.role !== "parent") {
      return res.status(400).json({ msg: "parentID must be a valid parent user" });
    }

    const cls = await Class.findById(classId).select("_id homeroomTeacherID");
    if (!cls) return res.status(400).json({ msg: "classId invalid" });


    const doc = await Child.create({ name: name.trim(), birthDate: bdate, parentID, classId });
    const populated = await Child.findById(doc._id)
      .populate("parentID", "name email")
      .populate("classId", "name grade");
    res.status(201).json(populated);
  } catch (e) { next(e); }
};




// GET /children (admin, teacher, parent via /my)
export const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, classId, parentId } = req.query;
    const q = {};
    if (classId && isObjectId(classId)) q.classId = classId;
    if (parentId && isObjectId(parentId)) q.parentID = parentId;

    if (req.user.role === "teacher") {
      const classes = await Class.find({
        homeroomTeacherIDs: { $in: [req.user.sub] }
      }).select("_id");

      const ids = classes.map((c) => c._id);

      q.classId = q.classId ? q.classId : { $in: ids };
    }


    const rows = await Child.find(q)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate("parentID", "name email")
      .populate("classId", "name grade")
      .lean();

    res.json({ page: +page, limit: +limit, count: rows.length, data: rows });
  } catch (e) { next(e); }
};

export const listMy = async (req, res, next) => {
  try {
    const parentId = req.user.sub;
    console.log("[Child.listMy] Parent ID:", parentId);
    console.log("[Child.listMy] User:", req.user);
    
    const rows = await Child.find({ parentID: parentId })
      .sort({ createdAt: -1 })
      .populate("classId", "name grade")
      .lean();
    
    console.log("[Child.listMy] Found children:", rows.length);
    console.log("[Child.listMy] Children:", rows);
    
    res.json(rows);
  } catch (e) { next(e); }
};

// GET /children/:id (admin, teacher)
export const detail = async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) return res.status(400).json({ msg: "id invalid" });
    const row = await Child.findById(req.params.id)
      .populate("parentID", "name email")
      .populate("classId", "name grade");
    if (!row) return res.status(404).json({ msg: "not found" });

    if (req.user.role === "teacher") {
      const isAllowed = String(row.classId?.homeroomTeacherID || "") === String(req.user.sub);
      if (!isAllowed) return res.status(403).json({ msg: "forbidden" });
    }
    res.json(row);
  } catch (e) { next(e); }
};

// PATCH /children/:id (admin, teacher)
export const update = async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) return res.status(400).json({ msg: "id invalid" });

    const allowed = ["name", "birthDate"];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];
    
    // Admin bisa update parentID
    if (req.user.role === "admin" && req.body.parentID) {
      if (!isObjectId(req.body.parentID)) {
        return res.status(400).json({ msg: "parentID invalid" });
      }
      update.parentID = req.body.parentID;
    }

    if (update.birthDate) {
      const b = new Date(update.birthDate);
      if (isNaN(b.getTime()) || b > new Date()) {
        return res.status(400).json({ msg: "birthDate invalid" });
      }
      update.birthDate = b;
    }
    if (update.name) update.name = String(update.name).trim();

    let row = await Child.findById(req.params.id).populate("classId", "homeroomTeacherID");
    if (!row) return res.status(404).json({ msg: "not found" });

    if (req.user.role === "teacher") {
      const isAllowed = String(row.classId?.homeroomTeacherID || "") === String(req.user.sub);
      if (!isAllowed) return res.status(403).json({ msg: "forbidden" });
    }

    row = await Child.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate("parentID", "name email")
      .populate("classId", "name grade");

    res.json(row);
  } catch (e) { next(e); }
};

// PATCH /children/:id/transfer (admin, teacher wali kelas)
export const transfer = async (req, res, next) => {
  try {
    const { classId } = req.body;
    if (!isObjectId(req.params.id) || !isObjectId(classId)) {
      return res.status(400).json({ msg: "id/classId invalid" });
    }
    const target = await Class.findById(classId).select("_id homeroomTeacherID");
    if (!target) return res.status(400).json({ msg: "classId invalid" });

    if (req.user.role === "teacher") {
      const isHomeroom = String(target.homeroomTeacherID || "") === String(req.user.sub);
      if (!isHomeroom) return res.status(403).json({ msg: "forbidden" });
    }

    const row = await Child.findByIdAndUpdate(
      req.params.id,
      { classId },
      { new: true }
    ).populate("classId", "name grade");

    if (!row) return res.status(404).json({ msg: "not found" });
    res.json(row);
  } catch (e) { next(e); }
};

// DELETE /children/:id (admin)
export const remove = async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) return res.status(400).json({ msg: "id invalid" });
    const row = await Child.findByIdAndDelete(req.params.id);
    if (!row) return res.status(404).json({ msg: "not found" });
    res.status(204).end();
  } catch (e) { next(e); }
};

// PATCH /children/:id/remove
export const removeFromClass = async (req, res, next) => {
  try {
    const childId = req.params.id;

    if (!isObjectId(childId)) {
      return res.status(400).json({ msg: "id invalid" });
    }

    // cari anak
    const child = await Child.findById(childId);
    if (!child) return res.status(404).json({ msg: "child not found" });

    // keluarkan dari kelas
    child.classId = null;
    await child.save();

    res.json({ msg: "Child removed from class", child });
  } catch (e) {
    next(e);
  }
};
