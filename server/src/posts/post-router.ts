import { Request, Response, Router } from "express";
import { Types } from "mongoose";
import multer from "multer";
import { Readable } from "stream";
import { ImageModel } from "../images/image-model";
import { isAuthenticated, isOwnerOrAdmin } from "../middlewares";
import { getImageBucket } from "../utils/gridfs-config";
import { PostModel } from "./post-model";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(
      file.originalname.toLowerCase().split(".").pop() || "",
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find({})
      .populate("author", "username")
      .populate("image");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await PostModel.findById(req.params.id)
      .populate("author", "username")
      .populate("image");

    if (!post) {
      return res.status(404).json(`Post with id ${req.params.id} not found`);
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json("Error fetching post");
  }
};

const uploadImageToGridFS = async (
  uploadFile: Express.Multer.File,
  userId: string,
): Promise<Types.ObjectId> => {
  const readableStream = new Readable();
  readableStream.push(uploadFile.buffer);
  readableStream.push(null);

  const bucket = getImageBucket();
  const filename = `${Date.now()}-${uploadFile.originalname.replace(/\s+/g, "-")}`;

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        uploadedBy: userId,
        originalName: uploadFile.originalname,
        contentType: uploadFile.mimetype,
      },
    });

    readableStream.pipe(uploadStream);

    uploadStream.on("error", (error) => {
      reject(error);
    });

    uploadStream.on("finish", async () => {
      try {
        const image = new ImageModel({
          filename: uploadStream.filename,
          contentType: uploadFile.mimetype,
          size: uploadStream.length,
          fileId: uploadStream.id,
          metadata: {
            uploadedBy: new Types.ObjectId(userId),
            originalName: uploadFile.originalname,
          },
          posts: [],
        });

        await image.save();
        console.log("Image uploaded successfully, ID:", image._id);
        resolve(image._id);
      } catch (err) {
        console.error("Error saving image model:", err);
        // Delete the GridFS file if model save fails
        bucket.delete(uploadStream.id as any).catch(console.error);
        reject(err);
      }
    });
  });
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

    const userId = req.session!.id;
    let imageId = undefined;

    if (req.file) {
      try {
        console.log("Uploading image to GridFS:", req.file.originalname);
        imageId = await uploadImageToGridFS(req.file, userId);
        console.log("Image uploaded successfully, ID:", imageId);
      } catch (error) {
        console.error("Error uploading image to GridFS:", error);
        return res.status(500).json({
          error: "Error uploading image",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const post = new PostModel({
      title,
      content,
      author: new Types.ObjectId(userId),
      image: imageId,
    });

    await post.save();
    console.log("Post saved:", post._id);

    if (imageId) {
      await ImageModel.findByIdAndUpdate(imageId, {
        $push: { posts: post._id },
      });
      console.log("Image updated with post reference");
    }

    const postObject = post.toObject();

    if (postObject.author) {
      postObject.author = post.author;
    }

    res.status(201).json(postObject);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      error: "Error creating post",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const isFormData = req.headers["content-type"]?.includes(
      "multipart/form-data",
    );
    const { title, content } = req.body;
    const postId = req.params.id;
    const userId = req.session!.id;

    if (Object.keys(req.body).length === 0 && !req.file) {
      return res.status(400).json("No update data provided");
    }

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json(`Post with id ${postId} not found`);
    }

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

    if (req.file) {
      try {
        const newImageId = await uploadImageToGridFS(req.file, userId);
        updateData.image = newImageId;

        if (post.image) {
          const oldImage = await ImageModel.findById(post.image);
          if (oldImage) {
            const shouldDeleteImage = await oldImage.removePostReference(
              post._id,
            );

            if (shouldDeleteImage) {
              const bucket = getImageBucket();
              await bucket.delete(oldImage.fileId! as any);
              await ImageModel.findByIdAndDelete(oldImage._id);
            }
          }
        }

        await ImageModel.findByIdAndUpdate(newImageId, {
          $push: { posts: post._id },
        });
      } catch (error) {
        return res.status(500).json("Error uploading image");
      }
    } else if (req.body.removeImage === "true" && post.image) {
      const oldImage = await ImageModel.findById(post.image);
      if (oldImage) {
        const shouldDeleteImage = await oldImage.removePostReference(post._id);

        if (shouldDeleteImage) {
          const bucket = getImageBucket();
          await bucket.delete(oldImage.fileId! as any);
          await ImageModel.findByIdAndDelete(oldImage._id);
        }
      }

      updateData.image = null;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json("No valid fields to update");
    }

    const updatedPost = await PostModel.findByIdAndUpdate(postId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("author", "username")
      .populate("image");

    if (!updatedPost) {
      return res.status(404).json(`Post with id ${postId} not found`);
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    const errorMsg = (error as Error).message.toLowerCase();

    if (errorMsg.includes("title")) {
      return res.status(400).json("Invalid title");
    } else if (errorMsg.includes("content")) {
      return res.status(400).json("Invalid content");
    } else if (errorMsg.includes("author")) {
      return res.status(400).json("Invalid author");
    } else {
      return res.status(400).json("Invalid field values");
    }
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json(`Post with id ${postId} not found`);
    }

    if (post.image) {
      const image = await ImageModel.findById(post.image);
      if (image) {
        const shouldDeleteImage = await image.removePostReference(post._id);

        if (shouldDeleteImage) {
          const bucket = getImageBucket();
          await bucket.delete(image.fileId! as any);
          await ImageModel.findByIdAndDelete(image._id);
        }
      }
    }

    await PostModel.findByIdAndDelete(postId);

    res.status(204).end();
  } catch (error) {
    res.status(500).json("Error deleting post");
  }
};

const favoritePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.session!.id;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json(`Post with id ${postId} not found`);
    }

    // Check if user already favorited
    if (
      post.favorites &&
      post.favorites.some((fav) => fav.toString() === userId)
    ) {
      return res.status(400).json("Post already favorited");
    }

    // Add user to favorites
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $addToSet: { favorites: new Types.ObjectId(userId) } },
      { new: true },
    )
      .populate("author", "username")
      .populate("image");

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json("Error favoriting post");
  }
};

const unfavoritePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.session!.id;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json(`Post with id ${postId} not found`);
    }

    // Remove user from favorites
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $pull: { favorites: new Types.ObjectId(userId) } },
      { new: true },
    )
      .populate("author", "username")
      .populate("image");

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json("Error unfavoriting post");
  }
};

export const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);

postRouter.post("/", isAuthenticated, upload.single("image"), createPost);
postRouter.put("/:id", isOwnerOrAdmin, upload.single("image"), updatePost);
postRouter.delete("/:id", isOwnerOrAdmin, deletePost);

postRouter.post("/:id/favorite", isAuthenticated, favoritePost);
postRouter.delete("/:id/favorite", isAuthenticated, unfavoritePost);
