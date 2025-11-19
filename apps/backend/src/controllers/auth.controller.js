// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Child from "../models/Child.js";

const issueToken = (user) => {
  const payload = { sub: user._id.toString(), role: user.role, name: user.name };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const ping = (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = "parent" } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "email & password required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "email already exists" });

    //hash password user bcryptjs
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });

    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) { next(err); }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1) cari user (email distandardkan)
  const u = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
  if (!u) return res.status(401).json({ msg: "invalid credentials" });

  // 2) cek password
  const ok = await bcrypt.compare(password, u.password);
  if (!ok) return res.status(401).json({ msg: "invalid credentials" });

  // 3) build JWT payload
  const payload = { sub: u._id.toString(), role: u.role, email: u.email };

  // 3a) jika parent, include childIDs di payload
  if (u.role === "parent") {
    const children = await Child.find({ parentID: u._id }).select("_id");
    payload.childIDs = children.map((c) => c._id.toString());
  }

  // 3b) sign token
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  // set cookie httpOnly
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,      // localhost = false
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
  });


  // 4) balikin token
  res.json({
    token,
    user: { id: u._id, name: u.name, email: u.email, role: u.role }
  });
};

export const changePassword = async (req, res, next) => {

  try {
    const userId = req.user?.sub;
    const {currentPassword, newPassword} = req.body;
    if(!userId) return res.status(401).json({msg: 'unauthenticated'});
    if(!currentPassword||!newPassword) return res.status(400).json({msg: 'currentPassword and newPassword are required'});
    if(currentPassword===newPassword) return res.status(400).json({msg: 'new password must be different from current password'});

    const user = await User.findById(userId).select('+password');
    if(!user) return res.status(404).json({msg: 'user not found'});

    const ok = await bcrypt.compare(currentPassword, user.password);
    if(!ok) return res.status(400).json({msg: 'current password is incorrect'});  

    user.password = await bcrypt.hash(newPassword, 10); //hash new password
    await user.save();

    res.json({msg: 'password changed successfully'});
  } catch (err) { next(err); }
};
