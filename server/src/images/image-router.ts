import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import multer from "multer";
import { Readable } from "stream";
import { getImageBucket } from "../utils/gridfs-config";
import { ImageModel } from "./image-model";
import { isAuthenticated, isAdmin } from "../middlewares";
import { ObjectId } from "bson";

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
      file.originalname.toLowerCase().split(".").pop() || ""
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, jpeg, png, gif, webp) are allowed"));
    }
  },
});

export const imageRouter = Router();

imageRouter.post(
  "/",
  isAuthenticated,
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No image file provided",
        });
      }

      const bucket = getImageBucket();
      const userId = new Types.ObjectId(req.session!.userId);

      const filename = `${Date.now()}-${req.file.originalname.replace(
        /\s+/g,
        "-"
      )}`;

      const readableStream = new Readable();
      readableStream.push(req.file.buffer);
      readableStream.push(null);

      const uploadStream = bucket.openUploadStream(filename, {
        contentType: req.file.mimetype,
        metadata: {
          uploadedBy: userId,
          originalName: req.file.originalname,
        },
      });

      readableStream.pipe(uploadStream);

      return new Promise((resolve, reject) => {
        uploadStream.on("error", (error) => {
          console.error("Failed to upload image to GridFS:", error);
          reject(error);
        });

        uploadStream.on(
          "finish",
          async (file: {
            filename: any;
            contentType: any;
            length: any;
            _id: ObjectId;
          }) => {
            try {
              const image = new ImageModel({
                filename: file.filename,
                contentType: file.contentType,
                size: file.length,
                fileId: file._id,
                metadata: {
                  uploadedBy: userId,
                  originalName: req.file?.originalname,
                },
                posts: [],
              });

              await image.save();

              res.status(201).json({
                success: true,
                image: image.toObject(),
              });
              resolve();
            } catch (err) {
              console.error("Failed to save image metadata:", err);
              bucket.delete(file._id).catch((deleteErr) => {
                console.error(
                  "Failed to delete GridFS file after metadata save error:",
                  deleteErr
                );
              });
              reject(err);
            }
          }
        );
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload image",
      });
    }
  }
);

imageRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const imageId = req.params.id;

    const image = await ImageModel.findById(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: "Image not found",
      });
    }

    res.set("Content-Type", image.contentType);
    res.set("Cache-Control", "public, max-age=31536000");
    res.set(
      "Content-Disposition",
      `inline; filename="${image.metadata?.originalName || image.filename}"`
    );

    const bucket = getImageBucket();
    const downloadStream = bucket.openDownloadStream(
      new ObjectId(image.fileId.toString())
    );

    downloadStream.on("error", (error) => {
      console.error("Error streaming image:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: "Failed to retrieve image",
        });
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Image retrieval error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to retrieve image",
    });
  }
});

imageRouter.get("/metadata/:id", async (req: Request, res: Response) => {
  try {
    const imageId = req.params.id;

    const image = await ImageModel.findById(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: "Image not found",
      });
    }

    res.json({
      success: true,
      image: image.toObject(),
    });
  } catch (error) {
    console.error("Error retrieving image metadata:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve image metadata",
    });
  }
});

imageRouter.delete(
  "/:id",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const imageId = req.params.id;

      const image = await ImageModel.findById(imageId);

      if (!image) {
        return res.status(404).json({
          success: false,
          error: "Image not found",
        });
      }

      const isOwner =
        image.metadata?.uploadedBy?.toString() === req.session!.userId;
      const isUserAdmin = req.session!.isAdmin;

      if (!isOwner && !isUserAdmin) {
        return res.status(403).json({
          success: false,
          error: "Not authorized to delete this image",
        });
      }

      if (image.posts.length > 0) {
        return res.status(409).json({
          success: false,
          error: "Image is still in use by posts and cannot be deleted",
          posts: image.posts,
        });
      }

      const bucket = getImageBucket();
      await bucket.delete(new ObjectId(image.fileId.toString()));

      await ImageModel.findByIdAndDelete(imageId);

      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (error) {
      console.error("Image deletion error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete image",
      });
    }
  }
);

imageRouter.get(
  "/",
  isAuthenticated,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const images = await ImageModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await ImageModel.countDocuments();

      res.json({
        success: true,
        images,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      });
    } catch (error) {
      console.error("Error retrieving images:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve images",
      });
    }
  }
);
