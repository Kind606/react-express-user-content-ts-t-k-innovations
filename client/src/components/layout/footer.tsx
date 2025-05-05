import { Box, Link as MuiLink, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#333", // Darker background
        color: "#fff", // White text for contrast
        padding: 3, // Increased padding for a larger footer
        marginTop: "auto",
        textAlign: "center",
        borderTop: "1px solid #444", // Subtle border for separation
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
          sx={{ fontSize: "1rem" }} // Slightly larger font size
        >
          About
        </MuiLink>
        <MuiLink
          component={Link}
          to="/terms"
          color="inherit"
          underline="hover"
          sx={{ fontSize: "1rem" }} // Slightly larger font size
        >
          Terms
        </MuiLink>
        <MuiLink
          component={Link}
          to="/privacy"
          color="inherit"
          underline="hover"
          sx={{ fontSize: "1rem" }} // Slightly larger font size
        >
          Privacy
        </MuiLink>
      </Box>
    </Box>
  );
};

export default Footer;
