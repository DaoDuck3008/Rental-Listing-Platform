import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getRedis } from "../config/redis.js";
import TooManyRequestsError from "../errors/TooManyRequestsError.js";

export const listingCreationLimiter = rateLimit({
  windowMs: 12 * 60 * 60 * 1000, // 12 giờ
  limit: 10, // 10 bài viết/12 giờ
  standardHeaders: true,
  legacyHeaders: false,
  validate: { default: false }, // Tắt cảnh báo IPv6 để tránh lỗi crash
  store: new RedisStore({
    sendCommand: (...args) => getRedis().call(...args),
  }),
  keyGenerator: (req) => {
    // Luôn dựa trên User ID vì đã được bảo vệ bởi middleware protect
    return req.user.id.toString();
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
  validate: { default: false }, // Tắt cảnh báo IPv6
  store: new RedisStore({
    sendCommand: (...args) => getRedis().call(...args),
  }),
  handler: (req, res, next, options) => {
    next(new TooManyRequestsError("Hệ thống đang bận, vui lòng thử lại sau ít phút."));
  },
});

