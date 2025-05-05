import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostById, updatePost } from "../services/postService";
import { useAuth } from "../hooks/useAuth";

const EditPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [keepExistingImage, setKeepExistingImage] = useState(true);
  const [error, setError] = useState("");

  const {
    data: post,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      if (post.image) {
        setImagePreview(post.image);
      }
    }
  }, [post]);

  useEffect(() => {
    if (post && user) {
      const authorId =
        typeof post.author === "string" ? post.author : post.author._id;
      const isAuthor = authorId === user._id;
      const isAdmin = user.isAdmin;

      if (!isAuthor && !isAdmin) {
        navigate(`/posts/${id}`, {
          state: { error: "You are not authorized to edit this post" },
        });
      }
    }
  }, [post, user, id, navigate]);

  const updatePostMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      navigate(`/posts/${id}`);
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to update post. Please try again.");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setKeepExistingImage(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !content) {
      setError("Please provide both title and content");
      return;
    }

    const formData = new FormData();
    formData.append("id", id as string);
    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    } else if (post?.image && keepExistingImage) {
      // For handling existing images
      formData.append("keepExistingImage", "true");
    }

    updatePostMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="loading">Loading post...</div>;
  }

  if (isError) {
    return (
      <div className="error-message">
        Error: {fetchError?.message || "Post not found"}
      </div>
    );
  }

  return (
    <div className="edit-post-page">
      <h1>Edit Post</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>

          {imagePreview && (
            <div className="current-image">
              <img src={imagePreview} alt="Current" />
              {post?.image && (
                <div className="image-options">
                  <label>
                    <input
                      type="checkbox"
                      checked={keepExistingImage}
                      onChange={(e) => setKeepExistingImage(e.target.checked)}
                    />
                    Keep existing image
                  </label>
                </div>
              )}
            </div>
          )}

          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={updatePostMutation.isPending}
        >
          {updatePostMutation.isPending ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
