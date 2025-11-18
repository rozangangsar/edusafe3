import { Router } from "express";
import { authMiddleware, roleRequired } from "../middlewares/authMiddleware.js";
import * as ctrl from "../controllers/ActivityChild.controller.js";

const r = Router();
r.use(authMiddleware);


r.get("/", ctrl.list);  

r.get("/mine", roleRequired("parent","teacher"), ctrl.listMine);

r.get("/:id", ctrl.detail);

r.post("/", roleRequired("teacher","admin"), ctrl.create);

r.patch("/:id", roleRequired("teacher","admin"), ctrl.update);

r.delete("/:id", roleRequired("teacher","admin"), ctrl.remove);

export default r;
