import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
  });

  userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
      // Hash the password here using bcrypt or any other hashing library
      // this.password = hashPassword(this.password);
    }
    next();
  });

export const UserModel = model("User", userSchema);

export type User = InferSchemaType<typeof userSchema>;
