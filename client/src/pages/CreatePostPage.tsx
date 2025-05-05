import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../services/postService";
import { useAuth } from "../hooks/useAuth";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Redirect if not logged in
  if (!user) {
    navigate("/login", {
      state: { message: "You must be logged in to create a post" },
    });
    return null;
  }

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/posts/${data._id}`);
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to create post. Please try again.");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);

      // Create image preview
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

    // Validate input
    if (!title || !content) {
      setError("Please provide both title and content");
      return;
    }

    // Create FormData for image upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    // Submit post creation
    createPostMutation.mutate(formData);
  };

  return (
    <div className="create-post-page">
      <h1>Create New Post</h1>

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
          <label htmlFor="image">Image (Optional)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={createPostMutation.isPending}
        >
          {createPostMutation.isPending ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
