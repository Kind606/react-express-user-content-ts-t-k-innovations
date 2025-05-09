import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getImageUrl } from "../services/imageService";
import { deletePost, getPostById } from "../services/postService";
import { ImageResponse } from "../types/Image";

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
    user &&
    (user.isAdmin ||
      (post &&
        typeof post.author !== "string" &&
        post.author._id === user._id));

  const getImageSrc = () => {
    if (!post?.image) return null;

    if (typeof post.image === "string") {
      return getImageUrl(post.image);
    } else {
      return getImageUrl((post.image as ImageResponse)._id);
    }
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
        <Alert severity="error">{error?.message || "Post not found"}</Alert>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Alert severity="error">Post not found</Alert>
      </Box>
    );
  }

  const imageUrl = getImageSrc();

  return (
    <Box>
      {/* Full-width image with Back to Posts button */}
      {imageUrl && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "80vh",
            overflow: "hidden",
          }}
        >
          <img
            src={imageUrl}
            alt={post.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Button
            component={Link}
            to="/posts"
            variant="contained"
            sx={{
              position: "absolute",
              bottom: "20px",
              left: "5%",
              backgroundColor: "#8f7474",
              color: "white",
              fontWeight: "bold",
              padding: "10px 20px",
              boxShadow: 3,
              "&:hover": {
                backgroundColor: "#655353",
              },
            }}
          >
            Back to Posts
          </Button>
        </Box>
      )}

      {/* Post content */}
      <Box
        sx={{
          maxWidth: 1000,
          margin: "20px auto",
          padding: 3,
          backgroundColor: "#fff",
          boxShadow: 3,
          borderRadius: 2,
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
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          By:{" "}
          {typeof post.author === "string" ? post.author : post.author.username}
        </Typography>

        {/* Render content with line breaks */}
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-wrap" }} // Preserve line breaks
        >
          {post.content}
        </Typography>

        {canModify && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              component={Link}
              to={`/posts/${post._id}/edit`}
              variant="contained"
              sx={{
                backgroundColor: "#8f7474",
                color: "white",
                "&:hover": {
                  backgroundColor: "#655353",
                },
              }}
            >
              Edit Post
            </Button>
            <Button
              onClick={handleDelete}
              variant="outlined"
              sx={{
                color: "#8f7474",
                borderColor: "#8f7474",
                "&:hover": {
                  backgroundColor: "#655353",
                  color: "white",
                  borderColor: "#655353",
                },
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Post"}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PostDetailPage;
