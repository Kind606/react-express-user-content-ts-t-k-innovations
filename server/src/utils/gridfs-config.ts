import mongoose from "mongoose";

let imageBucket: mongoose.mongo.GridFSBucket;

export function initializeGridFS() {
  if (!mongoose.connection.db) {
    throw new Error(
      "MongoDB connection not established. Call this after connecting to MongoDB.",
    );
  }

  imageBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
    chunkSizeBytes: 1024 * 255,
  });

  console.log("GridFS initialized successfully");
  return imageBucket;
}

export function getImageBucket(): mongoose.mongo.GridFSBucket {
  if (!imageBucket) {
    console.log("GridFS bucket not initialized, initializing now...");
    return initializeGridFS();
  }
  return imageBucket;
}
