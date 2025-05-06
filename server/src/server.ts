import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app";
import { initializeGridFS } from "./utils/gridfs-config";

dotenv.config();

const port = process.env.PORT ?? 3000;
const dbUrl = process.env.DATABASE_URL ?? "mongodb://localhost:27017/";

async function main() {
  await mongoose.connect(dbUrl);

  initializeGridFS();

  app.listen(port, () => {
    console.log(`Server is running: http://localhost:${port}`);
  });
}

main().catch(console.error);
