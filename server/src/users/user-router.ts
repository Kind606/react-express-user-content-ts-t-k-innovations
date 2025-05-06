import argon2 from "argon2";
import { Request, Response } from "express";
import { UserModel } from "./user-model";
import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares";

const userRouter = express.Router();

userRouter.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json("Username and password are required");
  }

  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    return res.status(409).json("Username already taken");
  }

  const user = new UserModel({ username, password });

  try {
    await user.save();

    req.session = {
      id: user._id.toString(),
      username: user.username,
      isAdmin: user.isAdmin,
    };

    res.status(201).json({
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

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

userRouter.get("/current", async (req, res) => {
  if (!req.session || !req.session.id) {
    return res.status(401).json("Not authenticated");
  }

  try {
    const user = await UserModel.findById(req.session.id, { password: 0 });
    if (!user) {
      return res.status(404).json("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json("Error fetching user");
  }
});

userRouter.post("/logout", (req, res) => {
  req.session = null;
  res.sendStatus(204);
});

userRouter.get(
  "/",
  isAuthenticated,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const users = await UserModel.find({}, { password: 0 });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json("Error fetching users");
    }
  }
);

userRouter.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { username, isAdmin } = req.body;

      const updateData: { username?: string; isAdmin?: boolean } = {};

      if (username !== undefined) {
        updateData.username = username;
      }

      if (isAdmin !== undefined) {
        updateData.isAdmin = isAdmin;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, select: "-password" }
      );

      if (!updatedUser) {
        return res.status(404).json(`User with id ${req.params.id} not found`);
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json("Error updating user");
    }
  }
);

userRouter.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        return res.status(404).json(`User with id ${req.params.id} not found`);
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json("Error deleting user");
    }
  }
);

export default userRouter;
