import { InferSchemaType, model, Schema } from "mongoose";
import argon2, { hash } from "argon2";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (err) {
    next(err as Error);
  }
});

export const UserModel = model("User", userSchema);
export type User = InferSchemaType<typeof userSchema>;
