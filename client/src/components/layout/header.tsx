import { AppBar, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  //replace it with actual auth logic later
  const isLoggedIn = false;
  const isAdmin = false;

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

          {isLoggedIn ? (
            <>
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
