import { AppBar, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar color="default" position="static">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mr: 2,
            cursor: "pointer",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontSize: "30px",
              fontWeight: "bolder",
            }}
          >
            Content Platform
          </Link>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link to="/posts">
            <Button color="inherit">Posts</Button>
          </Link>

          {user ? (
            <>
              <Link to="/create-post">
                <Button color="inherit">Create Post</Button>
              </Link>

              <Link to="/profile">
                <Button color="inherit">Profile</Button>
              </Link>

              {user.isAdmin && (
                <Link to="/admin">
                  <Button color="inherit">Admin</Button>
                </Link>
              )}

              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button color="inherit">Login</Button>
              </Link>

              <Link to="/register">
                <Button color="inherit">Register</Button>
              </Link>
            </>
          )}
        </Box>
      </Box>
    </AppBar>
  );
};

export default Header;
