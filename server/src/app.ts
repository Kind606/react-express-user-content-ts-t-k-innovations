import cookieSession from "cookie-session";
import express from "express";
import { errorHandler } from "./middlewares";
import { postRouter } from "./posts/post-router";
import userRouter from "./users/user-router";

require("express-async-errors");

export const app = express();

// SKRIV DIN SERVERKOD HÄR!¨

app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SECRET ?? "default_secret"], 
    maxAge: 24 * 60 * 60 * 1000, 
}));
app.use("/api/posts", postRouter);  
app.use("/api/users", userRouter);
app.use(errorHandler);
