import bcrypt from 'bcryptjs';
import User from "../models/User.js";
import Child from "../models/Child.js";



export const getUsers = async (req, res) =>{
  const q = {};
  if (req.query.role)  q.role = req.query.role;
  const rows = await User.find(q).select('-password').sort({ createdAt: -1 });
  res.json(rows);
};


export const detail = async (req, res) =>{
  const u = await User.findById(req.params.id).select('-password');
  if(!u) return res.status(404).json({msg: 'not found'});
  res.json(u);
};

async function upsertChildForParent({ parentId, childName, childBirthDate }) {
  if (!childName) return;
try {
  const name = childName.trim();
  const query = { name };
  if (childBirthDate) query.birthDate = childBirthDate;

  let child = await Child.findOne(query);

  if (!child) {
    child = await Child.create({
      name,
      birthDate: childBirthDate || null,
      parentID: parentId,
    });
  } else {
    child.parentID = parentId;
    await child.save();
  }
} catch (err) {
  console.error("UPSERT CHILD ERROR", err);}
}



export const create = async (req, res) => {
  try {
    const { name, email, password, role, childName, childBirthDate} = req.body;
    if (!email) return res.status(400).json({ msg: "email is required" });
    if (!password) return res.status(400).json({ msg: "password is required" });
    if (!["admin", "teacher", "parent"].includes(role)) {
      return res.status(400).json({ msg: "role is invalid" });
    }

    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: hash,
      role,
    });

    if (role === "parent") {
      await upsertChildForParent({
        parentId: u._id,
        childName,
        childBirthDate,
      });
    }

    return res
      .status(201)
      .json({ id: u._id, name: u.name, email: u.email, role: u.role });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ msg: "email already exists" });
    }
    console.error("CREATE USER ERROR", error);
    return res
      .status(500)
      .json({ msg: error.message || "server error" });
  }
};


export const update = async (req, res) => {
  try {
    const { name, email, password, role, childName, childBirthDate } = req.body;
    const update = {};

    if (name) update.name = name;
    if (email) update.email = email.trim().toLowerCase();
    if (password) update.password = await bcrypt.hash(password, 10);
    if (role) {
      if (!["admin", "teacher", "parent"].includes(role)) {
        return res.status(400).json({ msg: "invalid role" });
      }
      update.role = role;
    }

    const u = await User.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    ).select("-password");

    if (!u) return res.status(404).json({ msg: "not found" });

    if (u.role === "parent" && (childName || childBirthDate)) {
      await upsertChildForParent({
        parentId: u._id,
        childName,
        childBirthDate,
      });
    }

    res.json(u);
  } catch (error) {
    console.error("UPDATE USER ERROR", error);
    return res
      .status(500)
      .json({ msg: error.message || "server error" });
  }
};


export const remove = async (req, res) =>{
    const del = await User.findByIdAndDelete(req.params.id);
    if(!del) return res.status(404).json({msg: 'not found'});
    res.json({ok: true});
};

export const getAccounts = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();

    const combined = await Promise.all(
      users.map(async (u) => {
        const children =
          u.role === "parent"
            ? await Child.find({ parentID: u._id })
                .select("name birthDate")
                .lean()
            : [];

        return {
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          children,
        };
      })
    );

    res.json(combined);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server error" });
  }
};

export const listTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("_id name");
    res.json(teachers);
  } catch (e) {
    next(e);
  }
};


