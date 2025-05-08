import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let imageBucket: GridFSBucket;

export function initializeGridFS() {
  imageBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
    chunkSizeBytes: 1024 * 255,
  });

  return imageBucket;
}

export function getImageBucket(): GridFSBucket {
  return imageBucket ?? initializeGridFS();
}
