import { Types } from "mongoose";

export interface ImageMetadata {
  uploadedBy: Types.ObjectId;
  originalName?: string;
  description?: string;
}

export interface ImageResponse {
  _id: string;
  filename: string;
  contentType: string;
  size: number;
  uploadDate: Date;
  metadata: ImageMetadata;
  fileId: string;
  posts: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadImageResponse {
  success: boolean;
  image?: ImageResponse;
  error?: string;
}
