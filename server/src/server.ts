import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app";
import { initializeGridFS } from "./utils/gridfs-config";

dotenv.config();

const port = process.env.PORT || 3000;
const dbUrl =
  process.env.DATABASE_URL || "mongodb://localhost:27017/content-platform";

async function main() {
  try {
    // Connection pool optimized for traditional long-running server
    await mongoose.connect(dbUrl, {
      maxPoolSize: 50, // Based on expected peak concurrent requests
      minPoolSize: 10, // Pre-warmed connections ready for traffic spikes
      maxIdleTimeMS: 300000, // 5 minutes - stable servers benefit from persistent connections
      connectTimeoutMS: 10000, // 10 seconds - fail fast on connection issues
      socketTimeoutMS: 30000, // 30 seconds - prevent hanging queries for OLTP operations
      serverSelectionTimeoutMS: 5000, // 5 seconds - quick failover for replica set topology changes
    });
    console.log("Connected to MongoDB");

    initializeGridFS();

    app.listen(port, () => {
      console.log(`Server is running: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

main();
