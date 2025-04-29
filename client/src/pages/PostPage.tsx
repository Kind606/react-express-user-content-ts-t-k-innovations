import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllPosts } from "../services/postService";
import { PostCard } from "../components/posts/PostCard";
import { Post } from "../types/Post";

const PostsPage = () => {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  if (isLoading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (isError) {
    return (
      <div className="error-message">
        Error: {error?.message || "Failed to load posts"}
      </div>
    );
  }

  return (
    <div className="posts-page">
      <div className="page-header">
        <h1>Posts</h1>
        <Link to="/create-post" className="create-post-button">
          Create New Post
        </Link>
      </div>
      {posts && posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map((post: Post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="no-posts">
          <p>No posts available</p>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
