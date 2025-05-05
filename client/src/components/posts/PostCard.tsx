import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Post } from "../../types/Post";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const authorName =
    typeof post.author === "string" ? post.author : post.author?.username;

  return (
    <Card sx={{ maxWidth: 345, margin: "16px auto", boxShadow: 3 }}>
      {post.image && (        
        </div>
        <CardMedia
          component="img"
          height="140"
          image={`http://localhost:3000${post.image}`}
          alt={post.title}
        />
      )}
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          By: {authorName}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {post.content.length > 100
            ? `${post.content.substring(0, 100)}...`
            : post.content}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            component={Link}
            to={`/posts/${post._id}`}
            variant="contained"
            size="small"
          >
            Read More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
