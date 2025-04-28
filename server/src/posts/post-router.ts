import { Request, Response, Router } from "express";
import { isAuthenticated, isOwnerOrAdmin } from "../middlewares";
import { PostModel } from "./post-model";
import { Types } from "mongoose";

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find({}).populate("author", "username");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await PostModel.findById(req.params.id).populate(
      "author",
      "username"
    );

    if (!post) {
      return res
        .status(404)
        .json({ error: `Post with id ${req.params.id} not found` });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json("Error fetching post");
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json("Invalid title");
    }

    if (!content || typeof content !== "string") {
      return res.status(400).json("Invalid content");
    }

    const post = new PostModel({
      title,
      content,
      author: new Types.ObjectId(req.session!.id),
      image: req.body.image,
    });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json("Error creating post");
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const { title, content, image } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json("Invalid title");
    }

    if (!content || typeof content !== "string") {
      return res.status(400).json("Invalid content");
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      { title, content, image },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res
        .status(404)
        .json({ error: `Post with id ${req.params.id} not found` });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json("Error updating post");
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const deletedPost = await PostModel.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res
        .status(404)
        .json({ error: `Post with id ${req.params.id} not found` });
    }

    res.status(200).json({ message: "Post deleted", post: deletedPost });
  } catch (error) {
    res.status(500).json("Error deleting post");
  }
};

export const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);

postRouter.post("/", isAuthenticated, createPost);
postRouter.put("/:id", isOwnerOrAdmin, updatePost);
postRouter.delete("/:id", isOwnerOrAdmin, deletePost);
