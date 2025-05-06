import { Router, Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
import multer from "multer";
import { Readable } from "stream";
import { getImageBucket } from "../utils/gridfs-config";
import { ImageModel } from "./image-model";
import { isAuthenticated, isOwnerOrAdmin } from "../middlewares";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export const imageRouter = Router();

imageRouter.post(
  "/",
  isAuthenticated,
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    try {
      const bucket = getImageBucket();
      const userId = new Types.ObjectId(req.session!.id);
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

      uploadStream.on("finish", async (file) => {
        const image = new ImageModel({
          filename: file.filename,
          contentType: file.contentType,
          size: file.length,
          fileId: file._id,
          metadata: {
            uploadedBy: userId,
            originalName: req.file?.originalname,
          },
        });

        await image.save();
        res.status(201).json(image);
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

imageRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid image ID" });
    }

    const image = await ImageModel.findById(id);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.set("Content-Type", image.contentType);
    res.set("Cache-Control", "public, max-age=31536000");

    const bucket = getImageBucket();
    const downloadStream = bucket.openDownloadStream(image.fileId);

    downloadStream.pipe(res);

    downloadStream.on("error", (error) => {
      console.error("Image download error:", error);
      res.status(500).json({ error: "Failed to retrieve image" });
    });
  } catch (error) {
    console.error("Image retrieval error:", error);
    res.status(500).json({ error: "Failed to retrieve image" });
  }
});

imageRouter.delete(
  "/:id",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid image ID" });
      }

      const image = await ImageModel.findById(id);

      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }

      const isOwner = image.metadata.uploadedBy.toString() === req.session!.id;
      const isAdmin = req.session!.isAdmin;

      if (!isOwner && !isAdmin) {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this image" });
      }

      const bucket = getImageBucket();
      await bucket.delete(image.fileId);

      await ImageModel.findByIdAndDelete(id);

      res.status(204).end();
    } catch (error) {
      console.error("Image deletion error:", error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  }
);
