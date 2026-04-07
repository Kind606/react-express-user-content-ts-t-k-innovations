import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";

let imageBucket: GridFSBucket;

export function initializeGridFS() {
  imageBucket = new GridFSBucket(mongoose.connection.db as any, {
    bucketName: "images",
    chunkSizeBytes: 1024 * 255,
  });

  return imageBucket;
}

export function getImageBucket(): GridFSBucket {
  return imageBucket ?? initializeGridFS();
}
