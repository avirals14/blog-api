import express from "express";
import { createComment, deleteComment, getCommentsByPost } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.get("/post/:postId", getCommentsByPost);

// 🔐 Protected Routes
router.post("/", authMiddleware, createComment);
router.delete("/:id", authMiddleware, deleteComment);

export default router;