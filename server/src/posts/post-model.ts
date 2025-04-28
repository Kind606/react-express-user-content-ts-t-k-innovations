import { InferSchemaType, model, Schema, Types } from "mongoose";

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Types.ObjectId, ref: "User", required: true },
  image: { type: String },
});

export const PostModel = model("Post", postSchema);
export type Post = InferSchemaType<typeof postSchema>;
