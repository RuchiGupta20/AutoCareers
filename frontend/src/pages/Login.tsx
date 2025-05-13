// src/pages/Login.tsx
import React from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";

const bgImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpzyRiePwvNC-nFOJHDYBn-T7_otOOUas1Yw&s";
  const logoSrc = "/logo.png"; // adjust if needed

export default function Login() {
  const navigate = useNavigate();  
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ width: 320, p: 3, textAlign: "center" }}>
        {/* Logo */}
        <Box component="img" src={logoSrc} alt="AutoCareers" sx={{ height: 108, mb: 2, mx: "auto" }} />

        {/* Social buttons */}
        <Stack spacing={1} mb={2}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AppleIcon />}
            sx={{
              bgcolor: "black",
              "&:hover": { bgcolor: "#333" },
              textTransform: "none",
            }}
          

          >
            Continue with Apple
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ textTransform: "none" }}
          >
            Continue with Google
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Email + password */}
        <TextField
          label="Email"
          size="small"
          fullWidth
          margin="dense"
          autoComplete="email"
        />
        <TextField
          label="Password"
          type="password"
          size="small"
          fullWidth
          margin="dense"
          autoComplete="current-password"
        />

        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{ mt: 2, textTransform: "none" }}
          onClick={() => navigate("/register")}
        >
          Log in
        </Button>

        {/* Links */}
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          New User?{" "}
          <Link to="/register" style={{ textDecoration: "underline" }}>
            Sign up
          </Link>{" "}
          ·{" "}
          <Link to="/forgot-password" style={{ textDecoration: "underline" }}>
            Forgot Password?
          </Link>
        </Typography>
        
      </Card>
    </Box>
  );
}
