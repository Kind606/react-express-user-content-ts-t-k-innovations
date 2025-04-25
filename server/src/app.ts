import express from "express";
import { errorHandler } from "./middlewares";
import { postRouter } from "./posts/post-router";
import { userRouter } from "./users/user-router";

require("express-async-errors");

export const app = express();

// SKRIV DIN SERVERKOD HÄR!¨

app.use(express.json());
app.use(postRouter);
app.use(userRouter);
app.use(errorHandler);
