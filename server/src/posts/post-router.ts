import { Request, Response, Router } from "express";
import { isAuthenticated, isOwnerOrAdmin } from "../middlewares";
import { PostModel } from "./post-model";
import { Types } from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

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
      return res.status(404).json(`Post with id ${req.params.id} not found`);
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

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const post = new PostModel({
      title,
      content,
      author: new Types.ObjectId(req.session!.id),
      image: imageUrl,
    });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json("Error creating post");
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const isFormData = req.headers["content-type"]?.includes(
      "multipart/form-data"
    );

    if (Object.keys(req.body).length === 0 && !req.file) {
      return res.status(400).json("No update data provided");
    }

    const { title, content } = req.body;
    const updateData: any = {};

    if (isFormData) {
      if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
          return res.status(400).json("Invalid title");
        }
        updateData.title = title;
      }

      if (content !== undefined) {
        if (typeof content !== "string" || content.trim() === "") {
          return res.status(400).json("Invalid content");
        }
        updateData.content = content;
      }

      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }
    } else {
      for (const field of ["title", "content", "author"]) {
        if (!req.body.hasOwnProperty(field)) {
          return res.status(400).json(`Missing ${field}`);
        }
      }

      if (title === undefined || title === null) {
        return res.status(400).json("Missing title");
      }

      if (typeof title !== "string") {
        return res.status(400).json("Invalid title");
      }

      if (title.trim() === "") {
        return res.status(400).json("Title cannot be empty");
      }

      if (content === undefined || content === null) {
        return res.status(400).json("Missing content");
      }

      if (typeof content !== "string") {
        return res.status(400).json("Invalid content");
      }

      if (content.trim() === "") {
        return res.status(400).json("Content cannot be empty");
      }

      if (req.body.author === undefined || req.body.author === null) {
        return res.status(400).json("Missing author");
      }

      updateData.title = title;
      updateData.content = content;
      updateData.author = req.body.author;
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json(`Post with id ${req.params.id} not found`);
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Update post error:", error);

    const errorMsg = (error as Error).message.toLowerCase();

    if (errorMsg.includes("title")) {
      return res.status(400).json("Invalid title");
    } else if (errorMsg.includes("content")) {
      return res.status(400).json("Invalid content");
    } else if (errorMsg.includes("author")) {
      return res.status(400).json("Invalid author");
    } else {
      return res
        .status(400)
        .json("Invalid field values for title, content, or author");
    }
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const deletedPost = await PostModel.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json(`Post with id ${req.params.id} not found`);
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json("Error deleting post");
  }
};

export const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);

postRouter.post("/", isAuthenticated, upload.single("image"), createPost);
postRouter.put("/:id", isOwnerOrAdmin, upload.single("image"), updatePost);
postRouter.delete("/:id", isOwnerOrAdmin, deletePost);
