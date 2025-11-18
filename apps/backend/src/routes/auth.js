// routes/auth.routes.js
import { Router } from "express";
import { ping, changePassword, login, register } from "../controllers/auth.controller.js";
import { authMiddleware, roleRequired } from "../middlewares/authMiddleware.js";

const r = Router();

r.get("/ping", ping);
r.post("/register", authMiddleware,roleRequired("admin"), register); 
r.post("/login", login);
r.patch("/change-password", authMiddleware, changePassword);

r.get("/me", authMiddleware, (req, res) => {
  res.json({ userFromToken: req.user });
});

export default r;
