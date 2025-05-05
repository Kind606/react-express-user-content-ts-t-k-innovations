import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { deletePost, getPostById } from "../services/postService";

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

  return (
   
    <Box
      sx={{
        maxWidth: 800,
        margin: "50px auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          By:{" "}
          {typeof post.author === "string" ? post.author : post.author.username}
        </Typography>
     

      {post.image && (
        <CardMedia
          component="img"
          height="300"
          image={post.image}
          alt={post.title}
          sx={{ marginBottom: 2 }}
        />
      )}

   
        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>
    

      {canModify && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            component={Link}
            to={`/posts/${post._id}/edit`}
            variant="contained"
            color="primary"
          >
            Edit Post
          </Button>
          <Button
            onClick={handleDelete}
            variant="outlined"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </Button>
        </Box>
      )}

      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Button component={Link} to="/posts" variant="text">
          Back to Posts
        </Button>
      </Box>
    </Box>
  );
};

export default PostDetailPage;
