import api from "./api";
import { ImageResponse } from "../types/Image";

export const uploadImage = async (
  formData: FormData
): Promise<ImageResponse> => {
  const response = await api.post("/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.image;
};

export const getImageUrl = (imageId: string): string => {
  const baseUrl = import.meta.env.VITE_API_URL || "/api";
  return `${baseUrl}/images/${imageId}`;
};

export const getImageMetadata = async (
  imageId: string
): Promise<ImageResponse> => {
  const response = await api.get(`/images/metadata/${imageId}`);
  return response.data.image;
};

export const deleteImage = async (imageId: string): Promise<void> => {
  await api.delete(`/images/${imageId}`);
};
