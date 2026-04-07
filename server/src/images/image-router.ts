import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import multer from "multer";
import { Readable } from "stream";
import { isAdmin, isAuthenticated } from "../middlewares";
import { getImageBucket } from "../utils/gridfs-config";
import { ImageModel } from "./image-model";

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
      const userId = new Types.ObjectId(req.session!.id);

      const filename = `${Date.now()}-${req.file.originalname.replace(
        /\s+/g,
        "-",
      )}`;

      const readableStream = new Readable();
      readableStream.push(req.file.buffer);
      readableStream.push(null);

      const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          uploadedBy: userId,
          originalName: req.file.originalname,
          contentType: req.file.mimetype,
        },
      });

      readableStream.pipe(uploadStream);

      return new Promise((resolve, reject) => {
        uploadStream.on("error", (error) => {
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
                contentType: req.file!.mimetype,
                size: file.length,
                fileId: new Types.ObjectId(file._id),
                metadata: {
                  uploadedBy: userId,
                  originalName: req.file!.originalname,
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
              reject(err);
            }
          },
        );
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload image",
      });
    }
  },
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

    res.set("Content-Type", image.contentType as string);
    res.set("Cache-Control", "public, max-age=31536000");
    res.set(
      "Content-Disposition",
      `inline; filename="${(image.metadata as any)?.originalName || image.filename}"`,
    );

    const bucket = getImageBucket();
    const downloadStream = bucket.openDownloadStream(
      new ObjectId(image.fileId!.toString()),
    );

    downloadStream.on("error", (error) => {
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: "Failed to retrieve image",
        });
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
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
        (image.metadata as any)?.uploadedBy?.toString() === req.session!.id;
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
      await bucket.delete(new ObjectId(image.fileId!.toString()));

      await ImageModel.findByIdAndDelete(imageId);

      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete image",
      });
    }
  },
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
      res.status(500).json({
        success: false,
        error: "Failed to retrieve images",
      });
    }
  },
);
