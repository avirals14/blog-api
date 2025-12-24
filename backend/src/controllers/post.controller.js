import mongoose from "mongoose";
import PostModel from "../models/Post.model.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, isPublished } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "All fields are Required",
      });
    }

    const post = await PostModel.create({
      title,
      content,
      author: req.user.userId,
      isPublished: isPublished ?? true,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error : ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .populate("author", "name email");

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get All Posts error : ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Posts",
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID Format",
      });
    }

    const post = await PostModel.findOne({
      _id: id,
      isPublished: true,
    }).populate("author", "name email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.error("get Post by ID error : ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch post",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID Format",
      });
    }

    const { title, content, isPublished } = req.body;

    const post = await PostModel.findById(id).populate("author");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }

    // authorization check
    const isAuthor = post.author._id.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this post",
      });
    }

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (isPublished !== undefined) post.isPublished = isPublished;

    const updatedPost = await post.save();

    return res.status(200).json({
      success: true,
      message: "Post Updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update Post Error : ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update Post",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID Format",
      });
    }

    const post = await PostModel.findById(id).populate("author");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }

    // auth check
    const isAuthor = req.user.userId === post.author._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete post",
      });
    }

    // delete Post
    await post.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};