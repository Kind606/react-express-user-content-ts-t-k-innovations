import api from "./api";
import { Post } from "../types/Post";

// Authentication functions (this should be in authService.ts, but keeping for reference)
export const login = (username: string, password: string) =>
  api.post("/users/login", { username, password });

// Post-related API functions
export const getAllPosts = async (): Promise<Post[]> => {
  const response = await api.get("/posts");
  return response.data;
};

export const getPostById = async (id: string): Promise<Post> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (
  postData: Omit<Post, "_id" | "author">
): Promise<Post> => {
  const response = await api.post("/posts", postData);
  return response.data;
};

export const updatePost = async (formData: FormData): Promise<Post> => {
  const id = formData.get("id") as string;
  const response = await api.put(`/posts/${id}`, formData);
  return response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};
