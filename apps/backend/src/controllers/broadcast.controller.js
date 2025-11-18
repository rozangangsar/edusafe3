// src/controllers/broadcast.controller.js
import Broadcast from "../models/Broadcast.js";
import Class from "../models/Class.js";
import Child from "../models/Child.js";
import { cacheDelPrefix } from "../middlewares/cache.js";

const clearBroadcastCache = async () => {
  try {
    await cacheDelPrefix("/api/broadcasts");
  } catch (e) {
    console.warn("cacheDelPrefix failed:", e);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, content, startsAt, expiresAt } = req.body;
    const userId = req.user?.sub;
    const role = req.user?.role;

    if (!["admin", "teacher"].includes(role)) {
      return res
        .status(403)
        .json({ msg: "Hanya admin atau guru yang boleh membuat broadcast" });
    }

    if (!title || !content) {
      return res.status(400).json({ msg: "title & content wajib diisi" });
    }

    let classId = null;
    if (role === "teacher") {
      const classes = await Class.find(
        { homeroomTeacherIDs: userId },
        { _id: 1 }
      ).lean();

      if (!classes.length) {
        return res.status(400).json({
          msg: "Guru ini belum terdaftar sebagai wali kelas mana pun. Hubungi admin.",
        });
      }
      classId = classes[0]._id;
    }

    const payload = {
      title,
      content,
      createdBy: userId,
      createdByRole: role,
      classId,
    };

    if (startsAt) payload.startsAt = new Date(startsAt);
    if (expiresAt) payload.expiresAt = new Date(expiresAt);

    const row = await Broadcast.create(payload);
    let createdByRole = role;

    await clearBroadcastCache();

    res.status(201).json(row);
  } catch (e) {
    next(e);
  }
};

export const listActive = async (req, res, next) => {
  try {
    const now = new Date();
    const userId = req.user?.sub;
    const role = req.user?.role || "parent";

    const baseMatch = {
      startsAt: { $lte: now },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } },
      ],
    };

    let visibilityMatch = {};

    if (role === "admin") {
      visibilityMatch = {};
    } else if (role === "teacher") {
      const classes = await Class.find(
        { homeroomTeacherIDs: userId },
        { _id: 1 }
      ).lean();
      const classIds = classes.map((c) => c._id);

      visibilityMatch = {
        $or: [
          { createdByRole: "admin" },
          { createdByRole: "teacher", classId: { $in: classIds } },
        ],
      };
    } else if (role === "parent") {
      const children = await Child.find(
        { parentID: userId },
        { classId: 1 }
      ).lean();
      const classIds = children.map((c) => c.classId);

      visibilityMatch = {
        $or: [
          { createdByRole: "admin" },
          { createdByRole: "teacher", classId: { $in: classIds } },
        ],
      };
    } else {
      visibilityMatch = { createdByRole: "admin" };
    }

    const rows = await Broadcast.find({
      ...baseMatch,
      ...visibilityMatch,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const update = async (req, res, next) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.sub;
    const { id } = req.params;

    const broadcast = await Broadcast.findById(id);
    if (!broadcast) return res.status(404).json({ msg: "not found" });

    if (role === "teacher" && broadcast.createdBy.toString() !== userId) {
      return res.status(403).json({ msg: "tidak boleh mengubah broadcast ini" });
    }

    const { title, content, startsAt, expiresAt } = req.body;

    if (title !== undefined) broadcast.title = title;
    if (content !== undefined) broadcast.content = content;
    if (startsAt !== undefined) broadcast.startsAt = new Date(startsAt);
    if (expiresAt !== undefined) broadcast.expiresAt = new Date(expiresAt);

    await broadcast.save();
    await clearBroadcastCache();

    res.json(broadcast);
  } catch (e) {
    next(e);
  }
};

export const remove = async (req, res, next) => {
  try {
    const row = await Broadcast.findByIdAndDelete(req.params.id);
    if (!row) return res.status(404).json({ msg: "not found" });

    await clearBroadcastCache();
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
