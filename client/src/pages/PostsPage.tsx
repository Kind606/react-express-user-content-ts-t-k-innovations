import { Button, Grid, Link, Typography } from "@mui/material";
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
    return <Typography>Loading posts...</Typography>;
  }

  if (isError) {
    return (
      <Typography color="error">
        Error: {error?.message || "Failed to load posts"}
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Posts
      </Typography>
      <Button>
          <Link to="/create-post" className="create-post-button">
            Create New Post
          </Link>
        </Button>
      <Grid container spacing={2}>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <PostCard post={post} />
            </Grid>
          ))
        ) : (
          <Typography>No posts available</Typography>
        )}
        
      </Grid>
    </div>
  );
};

export default PostsPage;
