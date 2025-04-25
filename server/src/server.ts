import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app";

// HÄR SKRIVER NI KODEN FÖR ATT ANSLUTA TILL DATABASEN OCH STARTA SERVERN!
dotenv.config();

const port = process.env.PORT ?? 3000;
const dbUrl = process.env.DATABASE_URL ?? "mongodb://localhost:27017/";

async function main() {
  await mongoose.connect(dbUrl);
  app.listen(port, () => {
    console.log(`Server is running: http://localhost:${port}`);
  });
}

main().catch(console.error);
