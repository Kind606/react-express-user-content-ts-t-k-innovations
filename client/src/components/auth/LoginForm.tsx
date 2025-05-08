import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        textAlign="center"
        gutterBottom
        sx={{
          backgroundColor: "#8f7474",
          color: "white",
          padding: 2,
          borderRadius: 1,
          fontWeight: "bold",
        }}
      >
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
     
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#8f7474",
          color: "white",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#655353",
          },
        }}
      >
        Login
      </Button>
      <Typography variant="body2" textAlign="center" sx={{ marginTop: 2 }}>
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{
            textDecoration: "none",
            color: "#8f7474",
            fontWeight: "bold",
          }}
        >
          Register
        </Link>
      </Typography>
    </Box>
  );
}

export default LoginForm;
