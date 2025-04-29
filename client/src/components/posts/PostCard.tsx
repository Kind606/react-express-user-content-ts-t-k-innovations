import { Link } from "react-router-dom";
import { Post } from "../../types/Post";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const authorname =
    typeof post.author === "string" ? post.author : post.author?.username;

  return (
    <div className="post-card">
      {post.image && (
        <div className="post-image">
          <img src={post.image} alt={post.title} />
        </div>
      )}
      <div className="post-content">
        <h2 className="post-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h2>
        <p className="post-author">By: {authorname}</p>
        <p className="post-excerpt">
          {post.content.length > 100
            ? `${post.content.substring(0, 100)}...`
            : post.content}
        </p>
        <div className="post-actions">
          <Link to={`/posts/${post._id}`} className="read-more-btn">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};
