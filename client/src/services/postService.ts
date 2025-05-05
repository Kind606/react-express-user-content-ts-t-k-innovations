import api from "./api";
import { Post } from "../types/Post";

export const login = (username: string, password: string) =>
  api.post("/users/login", { username, password });

export const getAllPosts = async (): Promise<Post[]> => {
  const response = await api.get("/posts");
  return response.data;
};

export const getPostById = async (id: string): Promise<Post> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (formData: FormData): Promise<Post> => {
  const response = await api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updatePost = async (formData: FormData): Promise<Post> => {
  const id = formData.get("id") as string;
  const response = await api.put(`/posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};
