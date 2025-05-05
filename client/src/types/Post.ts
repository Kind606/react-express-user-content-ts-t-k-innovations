import { User } from "./User";

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User | string;
  image?: string;
  createdAt: string;
}
