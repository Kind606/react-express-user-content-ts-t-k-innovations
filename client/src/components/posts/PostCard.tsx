import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getImageUrl } from "../../services/imageService";
import { favoritePost, unfavoritePost } from "../../services/postService";
import { Post } from "../../types/Post";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: toggleFavorite, isPending } = useMutation({
    mutationFn: (isFavorited: boolean) =>
      isFavorited ? unfavoritePost(post._id) : favoritePost(post._id),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData<Post[]>(["posts"], (old) =>
        old?.map((p) => (p._id === updatedPost._id ? updatedPost : p)),
      );
    },
  });

  const authorName =
    typeof post.author === "string" ? post.author : post.author?.username;
  const imageUrl = post.image
    ? getImageUrl(typeof post.image === "string" ? post.image : post.image._id)
    : null;
  const isFavorited = user && post.favorites?.includes(user._id);
  const favoritesCount = post.favorites?.length || 0;

  return (
    <Card
      sx={{
        maxWidth: 345,
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
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.content.length > 100
            ? `${post.content.substring(0, 100)}...`
            : post.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          onClick={() => user && toggleFavorite(!!isFavorited)}
          disabled={!user || isPending}
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          {isFavorited ? (
            <FavoriteIcon sx={{ color: red[500] }} />
          ) : (
            <FavoriteBorderIcon />
          )}
          {favoritesCount > 0 && (
            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
              {favoritesCount}
            </Typography>
          )}
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
