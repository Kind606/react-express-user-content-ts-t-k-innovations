import { InferSchemaType, Schema, model, Types } from "mongoose";

const imageSchema = new Schema(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
    metadata: {
      uploadedBy: { type: Types.ObjectId, ref: "User", required: true },
      originalName: { type: String },
      description: { type: String },
    },
    fileId: { type: Types.ObjectId, required: true },
    posts: [{ type: Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

imageSchema.index({ fileId: 1 });
imageSchema.index({ "metadata.uploadedBy": 1 });
imageSchema.index({ posts: 1 });

imageSchema.methods.addPostReference = async function (postId: Types.ObjectId) {
  if (!this.posts.includes(postId)) {
    this.posts.push(postId);
    await this.save();
  }
  return this;
};

imageSchema.methods.removePostReference = async function (
  postId: Types.ObjectId
) {
  this.posts = this.posts.filter((id) => !id.equals(postId));

  if (this.posts.length === 0) {
    return true;
  }

  await this.save();
  return false;
};

export type ImageDocument = InferSchemaType<typeof imageSchema> & {
  addPostReference: (postId: Types.ObjectId) => Promise<ImageDocument>;
  removePostReference: (postId: Types.ObjectId) => Promise<boolean>;
};

export const ImageModel = model<ImageDocument>("Image", imageSchema);
