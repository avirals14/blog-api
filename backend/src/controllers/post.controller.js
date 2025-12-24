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
