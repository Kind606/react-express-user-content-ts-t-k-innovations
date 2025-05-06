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

export const ImageModel = model("Image", imageSchema);
export type Image = InferSchemaType<typeof imageSchema>;
