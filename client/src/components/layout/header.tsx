import {
  AppBar,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"; 
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = async () => {
    await logout();
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const renderLinks = () => (
    <>
      <Button component={Link} to="/" color="inherit">
        Home
      </Button>
      {user ? (
        <>
          <Button component={Link} to="/create-post" color="inherit">
            Create Post
          </Button>
          {user.isAdmin && (
            <Button component={Link} to="/admin" color="inherit">
              Admin
            </Button>
          )}
          <Button onClick={handleLogout} color="inherit">
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button component={Link} to="/login" color="inherit">
            Login
          </Button>
          <Button component={Link} to="/register" color="inherit">
            Register
          </Button>
        </>
      )}
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          backgroundColor: "#8f7474",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
       
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            fontFamily: "monospace",
            fontSize: "2rem",
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          T&K Innovations
        </Typography>

        {/* Responsive Navigation */}
        {isMobile ? (
          <>
            <Button
              onClick={toggleDrawer(true)}
              color="inherit"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              <MenuIcon />
            </Button>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  <ListItem component={Link} to="/">
                    <ListItemText primary="Home" />
                  </ListItem>
                  {user ? (
                    <>
                      <ListItem component={Link} to="/create-post">
                        <ListItemText primary="Create Post" />
                      </ListItem>
                      {user.isAdmin && (
                        <ListItem component={Link} to="/admin">
                          <ListItemText primary="Admin" />
                        </ListItem>
                      )}
                      <ListItem onClick={handleLogout}>
                        <ListItemText primary="Logout" />
                      </ListItem>
                    </>
                  ) : (
                    <>
                      <ListItem component={Link} to="/login">
                        <ListItemText primary="Login" />
                      </ListItem>
                      <ListItem component={Link} to="/register">
                        <ListItemText primary="Register" />
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>{renderLinks()}</Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
