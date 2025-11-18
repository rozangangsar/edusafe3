import { Router } from "express";
import { authMiddleware, roleRequired } from "../middlewares/authMiddleware.js";
import * as ctrl from "../controllers/Class.controller.js";

const r = Router();
r.use(authMiddleware);

r.post("/",roleRequired("admin"),ctrl.create);
r.get("/",roleRequired("admin","teacher"), ctrl.list);
r.get("/:id",roleRequired("admin","teacher"), ctrl.detail);
r.patch("/:id",roleRequired("admin"),ctrl.update);
r.delete("/:id",roleRequired("admin"),ctrl.remove);

r.post("/:id/homeroom",           roleRequired("admin"), ctrl.addHomeroom);
r.delete("/:id/homeroom/:teacherId", roleRequired("admin"), ctrl.removeHomeroom);

export default r;
