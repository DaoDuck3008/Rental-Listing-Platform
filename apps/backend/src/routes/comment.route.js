import express from "express";
import { optionalProtect, protect } from "../middlewares/auth.middleware.js";
import {
  create,
  destroy,
  getReplies,
  index,
  like,
  update,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/listings/:id", optionalProtect, index);
router.get("/:id/replies", optionalProtect, getReplies);

router.use(protect);

router.post("/listings/:id", create);
router.put("/:id", update);
router.delete("/:id", destroy);
router.post("/:id/likes", like);

export default router;
