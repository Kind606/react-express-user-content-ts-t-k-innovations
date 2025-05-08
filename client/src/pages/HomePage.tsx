import React, { useState, useEffect } from "react";
import PostPage from "./PostsPage";
import { useAuth } from "../hooks/useAuth";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(true);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const welcomeMessage = user?.username
    ? `Welcome ${user.username}`
    : "Welcome Guest";

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <div className="home-page">
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="info" variant="filled">
          {welcomeMessage}
        </Alert>
      </Snackbar>
      <PostPage />
    </div>
  );
};

export default HomePage;
