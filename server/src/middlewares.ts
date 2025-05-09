import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ message: err.message || "Internal server error" });
};

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session || !req.session.id) {
    return res.status(401).json("Authentication required");
  }
  next();
};

export const isOwnerOrAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session || !req.session.id) {
    return res.status(401).json("Authentication required");
  }

  const postId = req.params.id;

  if (!postId) {
    return next();
  }

  try {
    const post = await import("./posts/post-model").then((m) =>
      m.PostModel.findById(postId)
    );

    if (!post) {
      return res.status(404).json(`Post with id ${postId} not found`);
    }

    if (post.author.toString() === req.session.id || req.session.isAdmin) {
      return next();
    }

    return res.status(403).json("Not authorized to modify this post");
  } catch (error) {
    next(error);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.isAdmin) {
    return res.status(403).json("Admin privileges required");
  }
  next();
};
