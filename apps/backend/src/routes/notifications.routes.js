import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as ctrl from "../controllers/notification.controller.js";

const r = Router();
r.use(authMiddleware);

r.get("/", ctrl.listActive);

export default r;