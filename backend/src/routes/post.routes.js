import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

// Public Routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// 🔐 Protected route
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;