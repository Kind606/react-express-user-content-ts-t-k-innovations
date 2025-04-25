import { Request, Response, Router } from "express";
import { UserModel } from "./user-model";

const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserModel.find({});
  res.status(200).json(users);
};

const createUser = async (req: Request, res: Response) => {
  const user = await UserModel.create(req.body);
  res.status(201).json(user);
};



export const userRouter = Router()
  