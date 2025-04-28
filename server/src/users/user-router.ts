import argon2 from "argon2";
import { Request, Response } from "express";
import { UserModel } from "./user-model";
import express from "express";

const userRouter = express.Router();

// Register
userRouter.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    return res.status(400).json("Username already taken" );
  }

  const user = new UserModel({ username, password });
  await user.save();

  req.session = {
    id: user._id.toString(),
    username: user.username,
    isAdmin: user.isAdmin,
  };

  res.status(201).json({
    message: "User registered",
    user: { username: user.username, isAdmin: user.isAdmin },
  });
});

// Login
userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });
  
  if (!user) {
    return res.status(401).json("Invalid username or password");
  }

  const valid = await argon2.verify(user.password, password);

  if (!valid) {
    return res.status(401).json("Invalid username or password");
  }

  req.session = {
    id: user._id.toString(),
    username: user.username,
    isAdmin: user.isAdmin,
  };

  res.status(200).json({
    _id: user._id,
    username: user.username,
    isAdmin: user.isAdmin,
  });
});


userRouter.post("/logout", (req, res) => {
  req.session = null;
  res.sendStatus(204); 
});

export default userRouter;