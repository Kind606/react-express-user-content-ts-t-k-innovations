import cookieSession from "cookie-session";
import express from "express";
import path from "path";
import { errorHandler } from "./middlewares";
import { postRouter } from "./posts/post-router";
import userRouter from "./users/user-router";
import { imageRouter } from "./images/image-router";

require("express-async-errors");

export const app = express();

app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SECRET || "default_secret"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/images", imageRouter);

app.use(errorHandler);
