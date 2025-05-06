import { Box, Link as MuiLink, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#333", 
        color: "#fff", 
        padding: 3, 
        marginTop: "auto",
        textAlign: "center",
        borderTop: "1px solid #444", 
      }}
    >
      <Typography variant="body1" gutterBottom>
        &copy; {currentYear} Content Platform
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        <MuiLink
          component={Link}
          to="/about"
          color="inherit"
          underline="hover"
          sx={{ fontSize: "1rem" }} 
        >
          About
        </MuiLink>
        <MuiLink
          component={Link}
          to="/terms"
          color="inherit"
          underline="hover"
          sx={{ fontSize: "1rem" }} 
        >
          Terms
        </MuiLink>
        <MuiLink
          component={Link}
          to="/privacy"
          color="inherit"
          underline="hover"
          sx={{ fontSize: "1rem" }}
        >
          Privacy
        </MuiLink>
      </Box>
    </Box>
  );
};

export default Footer;
