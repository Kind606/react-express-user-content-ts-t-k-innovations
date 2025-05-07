import { User } from "./User";
import { ImageResponse } from "./Image";

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User | string;
  image?: ImageResponse | string;
  createdAt: string;
  updatedAt: string;
}
