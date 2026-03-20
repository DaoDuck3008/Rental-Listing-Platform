import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getRedis } from "../config/redis.js";
import TooManyRequestsError from "../errors/TooManyRequestsError.js";

export const listingCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 12000, // 12 giờ
  limit: 10, // 10 bài viết/12 giờ
  standardHeaders: true, // Trả về thông tin rate limit trong header
  legacyHeaders: false, // Không trả về header cũ
  store: new RedisStore({
    sendCommand: (...args) => getRedis().call(...args),
  }),
  keyGenerator: (req) => {
    return req.user?.id?.toString() || req.ip;
  },
  handler: (req, res, next, options) => {
    next(
      new TooManyRequestsError(
        "Bạn đã đăng quá nhiều bài viết trong thời gian ngắn. Vui lòng thử lại sau 12 giờ."
      )
    );
  },
});


// Limiter cho các API khác
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  limit: 100, // 100 request/15 phút
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => getRedis().call(...args),
  }),
  handler: (req, res, next, options) => {
    next(new TooManyRequestsError("Hệ thống đang bận, vui lòng thử lại sau ít phút."));
  },
});

