import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImagePrevRemove from "../components/ImagePrevRemove";
import { useAuth } from "../hooks/useAuth";
import { createPost } from "../services/postService";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/posts/${data._id}`);
    },
    onError: (error: unknown) => {
      console.error("Create post error:", error);
      
      let errorMessage = "Failed to create post. Please try again.";

      if (error && typeof error === "object") {
        const err = error as { response?: { data?: unknown }; message?: string };
        console.error("Error response:", err.response?.data);

        if (err.response?.data) {
          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else if (typeof err.response.data === "object" && err.response.data !== null) {
            const errorData = err.response.data as { error?: string; details?: string };
            if (errorData.error) {
              errorMessage = errorData.error;
              if (errorData.details) {
                errorMessage += `: ${errorData.details}`;
              }
            }
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    },
  });

  if (!user) {
    navigate("/login", {
      state: { message: "You must be logged in to create a post" },
    });
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);

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
    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    createPostMutation.mutate(formData);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "50px auto",
        padding: 3,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          color: "#8f7474",
          borderBottom: "2px solid #8f7474",
          paddingBottom: 2,
        }}
      >
        Create New Post
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
              <ImagePrevRemove
                setImagePreview={setImagePreview}
                setImage={setImage}
              />
            </Box>
          )}
        </Box>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            marginBottom: 2,
            backgroundColor: "#8f7474",
            color: "white",
            "&:hover": {
              backgroundColor: "#655353",
            },
          }}
          disabled={createPostMutation.isPending}
        >
          {createPostMutation.isPending ? "Creating..." : "Create Post"}
        </Button>
      </form>
    </Box>
  );
};

export default CreatePostPage;
