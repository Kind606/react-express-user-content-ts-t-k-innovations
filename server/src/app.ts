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

// Manual session parsing middleware (replaces cookie-session)
app.use((req, res, next) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const sessionCookie = cookies
      .split(";")
      .find((c) => c.trim().startsWith("session="));
    if (sessionCookie) {
      try {
        const sessionValue = sessionCookie.split("=")[1];
        const sessionJSON = Buffer.from(sessionValue, "base64").toString(
          "utf-8",
        );
        req.session = JSON.parse(sessionJSON);
        console.log("Session decoded:", req.session);
        console.log("Session.id immediately after parsing:", req.session.id);
        console.log("Type of req.session:", typeof req.session);
      } catch (err) {
        console.error("Failed to decode session:", err);
        req.session = null;
      }
    } else {
      req.session = null;
    }
  } else {
    req.session = null;
  }
  next();
});

// Add this middleware to log session cookie being sent (keep for debugging)
app.use((req, res, next) => {
  const originalSetHeader = res.setHeader.bind(res);
  res.setHeader = function (name: string, value: any) {
    if (name.toLowerCase() === "set-cookie") {
      console.log("Setting cookie:", value);
    }
    return originalSetHeader(name, value);
  };
  next();
});

// Cookie-session is no longer needed - we handle sessions manually above
// Commenting out to prevent conflicts
/*
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SECRET || "default_secret"],
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  }),
);
*/

app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/images", imageRouter);

app.use(errorHandler);
