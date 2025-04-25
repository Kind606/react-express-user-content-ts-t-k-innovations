import { Request, Response, Router } from "express";
import { PostModel } from "./post-model";

const getAllPosts = async (req: Request, res: Response) => {
  const posts = await PostModel.find({});
  res.status(200).json(posts);
};



export const postRouter = Router()
.get("/api/posts", getAllPosts)