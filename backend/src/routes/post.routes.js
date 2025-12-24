import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createPost, getAllPosts } from "../controllers/post.controller.js";

const router = express.Router();

// Public Routes
router.get("/", getAllPosts);

// 🔐 Protected route
router.post("/", authMiddleware, createPost);

export default router;