export interface ImageMetadata {
  uploadedBy: string;
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
