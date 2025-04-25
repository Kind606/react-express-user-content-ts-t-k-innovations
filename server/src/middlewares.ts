import { ErrorRequestHandler } from "express";
import { MongooseError } from "mongoose";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  if (err instanceof MongooseError) {
    res.status(404).json(err.message);
    return;
  }

  res.status(500).json("Internal server error");
};
