import mongoose from "mongoose";
import CommentModel from "../models/Comment.model.js";
import PostModel from "../models/Post.model.js";

// create Comment
export const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({
        success: false,
        message: "Post ID and content are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID Format",
      });
    }

    const post = await PostModel.findById(postId);

    if (!post || !post.isPublished) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }

    const comment = await CommentModel.create({
      content,
      post: postId,
      author: req.user.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Comment Added",
      comment,
    });
  } catch (error) {
    console.error("Create Comment Error : ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID Format",
      });
    }

    const comments = await CommentModel.find({ post: postId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};

// Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    const comment = await CommentModel.findById(id).populate("author");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const isAuthor = comment.author._id.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment",
      });
    }

    await comment.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};