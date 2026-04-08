import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import PostPage from "./PostsPage";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const welcomeMessage = user?.username
    ? `Welcome ${user.username}`
    : "Welcome Guest";

  useEffect(() => {
    const shouldShowWelcome = sessionStorage.getItem("showWelcome");
    if (shouldShowWelcome === "true") {
      setOpen(true);
      sessionStorage.removeItem("showWelcome");
    }
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
