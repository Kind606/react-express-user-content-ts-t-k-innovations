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
import { ImageResponse } from "../../types/Image";
import { getImageUrl } from "../../services/imageService";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const authorName =
    typeof post.author === "string" ? post.author : post.author?.username;

  const getImageSrc = () => {
    if (!post.image) return null;

    if (typeof post.image === "string") {
      return getImageUrl(post.image);
    } else {
      return getImageUrl((post.image as ImageResponse)._id);
    }
  };

  const imageUrl = getImageSrc();

  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: "16px auto",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt={post.title}
        />
      )}
      <CardContent>
        <Typography
          variant="h6"
          component={Link}
          to={`/posts/${post._id}`}
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
            "&:hover": { color: "primary.main" },
          }}
          gutterBottom
        >
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
        <Box sx={{ textAlign: "right" }}>
          <Button
            component={Link}
            to={`/posts/${post._id}`}
            variant="outlined"
            size="small"
          >
            Read More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
