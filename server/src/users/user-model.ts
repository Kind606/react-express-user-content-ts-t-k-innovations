import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
  });

export const UserModel = model("User", userSchema);

export type User = InferSchemaType<typeof userSchema>;
