import api from "./api";
import { User } from "../types/User";

export const getPosts = () => api.get("/posts");

export const login = async (
  username: string,
  password: string
): Promise<User> => {
  const response = await api.post("/users/login", { username, password });
  return response.data;
};

export const register = async (
  username: string,
  password: string
): Promise<User> => {
  const response = await api.post("/users/register", { username, password });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/users/logout");
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("/users/current");
  return response.data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};

export const updateUser = async (
  id: string,
  data: { isAdmin?: boolean; username?: string }
): Promise<User> => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
