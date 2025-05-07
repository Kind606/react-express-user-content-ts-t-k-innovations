import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let imageBucket: GridFSBucket;

export const initializeGridFS = (): GridFSBucket => {
  if (!mongoose.connection.db) {
    throw new Error("Database connection not established");
  }

  imageBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
    chunkSizeBytes: 1024 * 255,
  });

  console.log("GridFS bucket initialized for images");
  return imageBucket;
};

export const getImageBucket = (): GridFSBucket => {
  if (!imageBucket) {
    return initializeGridFS();
  }
  return imageBucket;
};
