import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getMiddayForecast, getWeeklyForecast  } from "../services/weather.service.js";
import { cacheSet, cacheGet, cacheFor } from "../middlewares/cache.js";

const r = Router();
//r.use(authMiddleware);

r.get("/midday",
  cacheFor(300),
  cacheGet,
  cacheSet,
  async (req, res, next) => {
    try {
      const lat = parseFloat(req.query.lat);
      const lon = parseFloat(req.query.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return res.status(400).json({ msg:"lat & lon required as numbers" });
      }
      const data = await getMiddayForecast(lat, lon);
      res.json(data);
    } catch (e) { next(e); }
  }
);

r.get("/weekly",
  cacheFor(600),
  cacheGet,
  cacheSet,
  async (req, res, next) => {
    try {
      const lat = parseFloat(req.query.lat);
      const lon = parseFloat(req.query.lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return res.status(400).json({ msg: "lat & lon required as numbers" });
      }

      const data = await getWeeklyForecast(lat, lon);
      res.json(data);
    } catch (e) { next(e); }
  }
);


export default r;
