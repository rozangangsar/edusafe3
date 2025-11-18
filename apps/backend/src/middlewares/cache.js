import redis from "../lib/redis.js";

function makeKey(req) {
  const role = req.user?.role || "anon";
  const uid  = req.user?._id || req.user?.sub || "nouser";
  return `${role}:${uid}:${req.originalUrl}`;
}

export function cacheGet(req, res, next) {
  const key = makeKey(req);
  redis.get(key).then((hit) => {
    if (hit) {
      res.set("X-Cache", "HIT");
      return res.json(JSON.parse(hit));
    }
    res.__cacheKey = key;
    res.set("X-Cache", "MISS");
    next();
  }).catch(next);
}

export function cacheSet(req, res, next) {
  const orig = res.json.bind(res);
  res.json = (body) => {
    const key = res.__cacheKey;
    if (key) {
      const ttl = Number(res.__cacheTTL || process.env.DEFAULT_CACHE_TTL || 300); // default 5 menit
      redis.set(key, JSON.stringify(body), "EX", ttl).catch(() => {});
    }
    return orig(body);
  };
  next();
}

export function cacheFor(seconds) {
  return function (req, res, next) {
    res.__cacheTTL = seconds;
    next();
  };
}

export async function cacheDelPrefix(prefix) {
  const pattern = `*:${prefix}*`;
  let cursor = "0", keys = [];
  do {
    const [cur, batch] = await redis.scan(cursor, "MATCH", pattern, "COUNT", "200");
    cursor = cur;
    keys = keys.concat(batch);
  } while (cursor !== "0");
  if (keys.length) await redis.del(keys);
}
