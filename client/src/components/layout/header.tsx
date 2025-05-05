import { AppBar, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mr: 2,
            cursor: "pointer",
          }}
        >
          <Link to="/" style={
            {
              textDecoration: "none",
              color: "inherit",
              fontSize: "30px",
              fontWeight: "bolder"
            }
          }>Content Platform</Link>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link to="/">
            <Button color="inherit">Home</Button>
          </Link>

          <Link to="/posts">
            <Button color="inherit">Post</Button>
          </Link>

          {user ? (
            <>
              <li>
                <Link to="/create-post">Create Post</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              {user.isAdmin && (
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </li>
              <Link to="/create-post">
                <Button color="inherit">Create Post</Button>
              </Link>

              <Link to="/profile">
                <Button color="inherit">Profile </Button>
              </Link>

              {isAdmin && <Link to="/admin">Admin</Link>}

              <button>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button color="inherit">Login </Button>
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
