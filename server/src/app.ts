import cookieSession from "cookie-session";
import cors from "cors";
import express from "express";
import { imageRouter } from "./images/image-router";
import { errorHandler } from "./middlewares";
import { postRouter } from "./posts/post-router";
import userRouter from "./users/user-router";

require("express-async-errors");

export const app = express();

// Debug logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Origin:", req.headers.origin);
  console.log("Cookie:", req.headers.cookie);
  next();
});

// CORS configuration for production deployment
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Important: allows cookies to be sent
  }),
);

console.log("=== Server Configuration ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("COOKIE_SECRET set:", !!process.env.COOKIE_SECRET);
console.log("===========================");

app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SECRET || "default_secret"],
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  }),
);

app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/images", imageRouter);

app.use(errorHandler);
