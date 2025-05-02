import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostById, deletePost } from "../services/postService";
import { useAuth } from "../hooks/useAuth";

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id as string),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/posts");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true);
      deleteMutation.mutate(id as string);
    }
  };

  const canModify =
    user && (user.isAdmin || (post && post.author._id === user._id));

  if (isLoading) {
    return <div className="loading">Loading post...</div>;
  }

  if (isError) {
    return (
      <div className="error-message">
        Error: {error?.message || "Post not found"}
      </div>
    );
  }

  if (!post) {
    return <div className="error-message">Post not found</div>;
  }

  return (
    <div className="post-detail-page">
      <div className="post-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By: {post.author.username}</span>
          <span>Posted: {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {post.image && (
        <div className="post-image">
          <img src={post.image} alt={post.title} />
        </div>
      )}

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {canModify && (
        <div className="post-actions">
          <Link to={`/posts/${post._id}/edit`} className="edit-button">
            Edit Post
          </Link>
          <button
            className="delete-button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      )}

      <Link to="/posts" className="back-button">
        Back to Posts
      </Link>
    </div>
  );
};

export default PostDetailPage;
