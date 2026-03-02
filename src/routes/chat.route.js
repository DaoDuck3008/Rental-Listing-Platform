import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  create,
  index,
  messages,
  send,
  markRead,
  destroy,
  updateMsg,
  deleteMsg,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", create);
router.get("/", index);
router.delete("/:id", destroy);
router.get("/:id/messages", messages);
router.post("/:id/messages", send);
router.patch("/messages/:id/read", markRead);
router.patch("/messages/:id", updateMsg);
router.delete("/messages/:id", deleteMsg);


export default router;
