import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError("");

    if (!username || !password) {
      setValidationError("Username and password are required");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    try {
      await register(username, password);
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
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
        Create an Account
      </Typography>
      {validationError && <Alert severity="error">{validationError}</Alert>}
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
      <TextField
        label="Confirm Password"
        type="password"
        variant="outlined"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
        Register
      </Button>
      <Typography variant="body2" textAlign="center" sx={{ marginTop: 2 }}>
        Already have an account?{" "}
        <Link
          to="/login"
          style={{
            textDecoration: "none",
            color: "#8f7474",
            fontWeight: "bold",
          }}
        >
          Log in
        </Link>
      </Typography>
    </Box>
  );
};

export default RegisterForm;
