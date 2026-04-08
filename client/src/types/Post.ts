import { ImageResponse } from "./Image";
import { User } from "./User";

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User | string;
  image?: ImageResponse | string;
  favorites?: string[];
  createdAt: string;
  updatedAt: string;
}
