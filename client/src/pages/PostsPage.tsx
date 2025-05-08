import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { PostCard } from "../components/posts/PostCard";
import { getAllPosts } from "../services/postService";
import { Post } from "../types/Post";
import TkInvoLogo from "../images/tkinvo.png";

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
    <>
      <Box sx={{ textAlign: "center", backgroundColor: "#bab7b7"}}>
      <img
          src={TkInvoLogo}
          alt="TkInvo Logo"
          style={{
            maxWidth: "100%",
            height: "auto",
            maxHeight: "300px",
          }}
        />
      </Box>
      <Container sx={{ marginTop: 4 }}>
          <Box sx={ {color: "#8f7474", borderBottom: "2px solid #8f7474", paddingBottom: 2}}>
            <Typography variant="h4" component="h1" gutterBottom>
              Posts
            </Typography>
          </Box>

          
        {posts && posts.length > 0 ? (
          <Grid container spacing={3}>
            {posts.map((post: Post) => (
              <Grid key={post._id}>
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
    </>
  );
};

export default PostsPage;
