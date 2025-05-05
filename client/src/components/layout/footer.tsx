import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#fffff",
        color: "black",
        textAlign: "center",
        py: 4,
      }}
    >
      <Box
        component="footer"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <p>&copy; {currentYear} Content Platform</p>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 2,
            "& a": {
              textDecoration: "none",
              color: "black",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          }}
        >
          <Link to="/about">About</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
