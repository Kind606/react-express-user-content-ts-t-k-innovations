import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getPostById, updatePost } from "../services/postService";
import { getImageUrl } from "../services/imageService";
import { ImageResponse } from "../types/Image";

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
        let imageId: string;

        if (typeof post.image === "string") {
          imageId = post.image;
        } else {
          imageId = (post.image as ImageResponse)._id;
        }

        setImagePreview(getImageUrl(imageId));
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
    } else if (!keepExistingImage && post?.image) {
      formData.append("removeImage", "true");
    }

    updatePostMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Loading post...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Alert severity="error">
          {fetchError?.message || "Post not found"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "50px auto",
        padding: 3,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Post
      </Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Content"
          variant="outlined"
          fullWidth
          multiline
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
        />
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1" gutterBottom>
            Image (Optional)
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "block", marginBottom: "8px" }}
          />
          {imagePreview && (
            <Box
              sx={{
                marginTop: 2,
                textAlign: "center",
                border: "1px solid #ddd",
                padding: 2,
                borderRadius: 2,
              }}
            >
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
              {post?.image && (
                <Box sx={{ marginTop: 1 }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={keepExistingImage}
                      onChange={(e) => setKeepExistingImage(e.target.checked)}
                    />
                    Keep existing image
                  </label>
                </Box>
              )}
            </Box>
          )}
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          Update Post
        </Button>
      </form>
    </Box>
  );
};

export default EditPostPage;
