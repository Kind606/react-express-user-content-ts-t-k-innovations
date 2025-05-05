import {
  Alert,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { PostCard } from "../components/posts/PostCard";
import { getAllPosts } from "../services/postService";
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
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Loading posts...
        </Typography>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <Alert severity="error">
          {error?.message || "Failed to load posts"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Posts
      </Typography>
      {posts && posts.length > 0 ? (
        <Grid container spacing={3}>
          {posts.map((post: Post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ textAlign: "center", marginTop: 4 }}
        >
          No posts available
        </Typography>
      )}
    </Container>
  );
};

export default PostsPage;
