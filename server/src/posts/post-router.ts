import { Request, Response, Router } from "express";
import { isAuthenticated, isOwnerOrAdmin } from "../middlewares";
import { PostModel } from "./post-model";
import { Types } from "mongoose";
import multer from "multer";
import { Readable } from "stream";
import { ImageModel } from "../images/image-model";
import { getImageBucket } from "../utils/gridfs-config";

// Configure multer for memory storage instead of disk storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(
      file.originalname.toLowerCase().split(".").pop() || ""
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
      .populate("image"); // Populate image data
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await PostModel.findById(req.params.id)
      .populate("author", "username")
      .populate("image"); // Populate image data

    if (!post) {
      return res.status(404).json(`Post with id ${req.params.id} not found`);
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json("Error fetching post");
  }
};

// Helper function to upload image to GridFS
const uploadImageToGridFS = async (
  file: Express.Multer.File,
  userId: string
): Promise<Types.ObjectId> => {
  // Create a readable stream from the buffer
  const readableStream = new Readable();
  readableStream.push(file.buffer);
  readableStream.push(null);

  const bucket = getImageBucket();
  const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: {
        uploadedBy: new Types.ObjectId(userId),
        originalName: file.originalname,
      },
    });

    // Pipe file buffer to GridFS
    readableStream.pipe(uploadStream);

    uploadStream.on("error", (error) => {
      reject(error);
    });

    uploadStream.on("finish", async (file) => {
      try {
        // Create an image document in our ImageModel
        const image = new ImageModel({
          filename: file.filename,
          contentType: file.contentType,
          size: file.length,
          fileId: file._id,
          metadata: {
            uploadedBy: new Types.ObjectId(userId),
            originalName: file.filename,
          },
          posts: [], // Will add the post reference later
        });

        await image.save();
        resolve(image._id);
      } catch (err) {
        // If metadata save fails, delete the GridFS file
        bucket.delete(file._id).catch(console.error);
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

    // If there's an image file, upload it to GridFS
    if (req.file) {
      try {
        imageId = await uploadImageToGridFS(req.file, userId);
      } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json("Error uploading image");
      }
    }

    // Create the post with image reference if available
    const post = new PostModel({
      title,
      content,
      author: new Types.ObjectId(userId),
      image: imageId,
    });

    await post.save();

    // If we have an image, update it to reference this post
    if (imageId) {
      await ImageModel.findByIdAndUpdate(imageId, {
        $push: { posts: post._id },
      });
    }

    // Return the created post with populated author and image
    const populatedPost = await PostModel.findById(post._id)
      .populate("author", "username")
      .populate("image");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json("Error creating post");
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const postId = req.params.id;
    const userId = req.session!.id;

    // Find the post to update
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json(`Post with id ${postId} not found`);
    }

    const updateData: any = {};

    // Update title and content if provided
    if (title && typeof title === "string") {
      updateData.title = title;
    }

    if (content && typeof content === "string") {
      updateData.content = content;
    }

    // Handle image update
    if (req.file) {
      try {
        // Upload new image to GridFS
        const newImageId = await uploadImageToGridFS(req.file, userId);
        updateData.image = newImageId;

        // If post already had an image, remove the post reference from that image
        if (post.image) {
          const oldImage = await ImageModel.findById(post.image);
          if (oldImage) {
            const shouldDeleteImage = await oldImage.removePostReference(
              post._id
            );

            // If true is returned, delete the old image as it's no longer referenced
            if (shouldDeleteImage) {
              const bucket = getImageBucket();
              await bucket.delete(oldImage.fileId);
              await ImageModel.findByIdAndDelete(oldImage._id);
            }
          }
        }

        // Update the new image to reference this post
        await ImageModel.findByIdAndUpdate(newImageId, {
          $push: { posts: post._id },
        });
      } catch (error) {
        console.error("Error uploading new image:", error);
        return res.status(500).json("Error uploading image");
      }
    } else if (req.body.removeImage === "true" && post.image) {
      // Handle image removal without replacement
      const oldImage = await ImageModel.findById(post.image);
      if (oldImage) {
        const shouldDeleteImage = await oldImage.removePostReference(post._id);

        // If true is returned, delete the old image as it's no longer referenced
        if (shouldDeleteImage) {
          const bucket = getImageBucket();
          await bucket.delete(oldImage.fileId);
          await ImageModel.findByIdAndDelete(oldImage._id);
        }
      }

      // Remove the image reference from the post
      updateData.image = null;
    }

    // Update the post
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
    console.error("Update post error:", error);
    res.status(500).json("Error updating post");
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    // Find the post to delete
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json(`Post with id ${postId} not found`);
    }

    // If post has an image, remove the post reference from that image
    if (post.image) {
      const image = await ImageModel.findById(post.image);
      if (image) {
        const shouldDeleteImage = await image.removePostReference(post._id);

        // If true is returned, delete the image as it's no longer referenced
        if (shouldDeleteImage) {
          const bucket = getImageBucket();
          await bucket.delete(image.fileId);
          await ImageModel.findByIdAndDelete(image._id);
        }
      }
    }

    // Delete the post
    await PostModel.findByIdAndDelete(postId);

    res.status(204).end();
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json("Error deleting post");
  }
};

export const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);

postRouter.post("/", isAuthenticated, upload.single("image"), createPost);
postRouter.put("/:id", isOwnerOrAdmin, upload.single("image"), updatePost);
postRouter.delete("/:id", isOwnerOrAdmin, deletePost);
