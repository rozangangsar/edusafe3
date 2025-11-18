// src/routes/Child.routes.js
import { Router } from "express";
import { authMiddleware, roleRequired } from "../middlewares/authMiddleware.js";
import * as ctrl from "../controllers/Child.controller.js";

const r = Router();
r.use(authMiddleware);

r.post("/",        roleRequired("admin"), ctrl.create); //hanya admin yak yang bisa bikin data anak 
r.get("/",         roleRequired("admin","teacher"), ctrl.list);
r.get("/my",       roleRequired("parent"),          ctrl.listMy);
r.get("/:id",      roleRequired("admin","teacher"), ctrl.detail);
r.patch("/:id",    roleRequired("admin","teacher"), ctrl.update); //teacher bisa update data anak
r.patch("/:id/transfer", roleRequired("admin"), ctrl.transfer);
r.delete("/:id",   roleRequired("admin"),           ctrl.remove);
r.patch("/:id/remove", roleRequired("admin"), ctrl.removeFromClass);



export default r;
