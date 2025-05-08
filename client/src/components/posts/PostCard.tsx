import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../services/imageService";
import { ImageResponse } from "../../types/Image";
import { Post } from "../../types/Post";

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
        maxWidth: 500,
        margin: "16px auto",
        borderRadius: 0,
        overflow: "hidden",
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="author">
            {authorName?.charAt(0).toUpperCase() || "U"}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
       
        subheader={`By: ${authorName}`}
      />
      {imageUrl && (
        <CardMedia
          component="img"
          height="194"
          sx={{
            position: "relative",
          }}
          image={imageUrl}
          alt={post.title}
        />
      )}
      <CardContent>
        {/* Add the post title */}
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: "bold",
            marginBottom: 1,
          }}
        >
          {post.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {post.content.length > 100
            ? `${post.content.substring(0, 100)}...`
            : post.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <Box sx={{ marginLeft: "auto" }}>
          <Button
            component={Link}
            to={`/posts/${post._id}`}
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              color: "#8f7474",
              borderColor: "#8f7474",
              "&:hover": {
                backgroundColor: "#655353",
                color: "white",
                borderColor: "##655353",
              },
            }}
          >
            Read More
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};
