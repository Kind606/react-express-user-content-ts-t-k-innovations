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
    await mongoose.connect(dbUrl);
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
