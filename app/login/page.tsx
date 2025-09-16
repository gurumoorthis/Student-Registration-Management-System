"use client";

import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Paper,
  Link as MuiLink,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { ERROR_MESSAGES } from "@/utils/constants";
import { getToastOptions } from "@/utils/getToastOptions";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { getUserById } from "@/redux/slice/AuthSlice";
import { useAppDispatch } from "@/redux/hooks";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (response.error) {
      toast.error(
        response.error?.message ?? ERROR_MESSAGES.GENERIC,
        getToastOptions()
      );
    } else {
      toast.success("Login success", getToastOptions());

      const user = response.data.user;
      dispatch(getUserById(user.id ?? ""));
      secureLocalStorage.setItem("user_id", user.id);
      secureLocalStorage.setItem("email", user.email ?? "");
      secureLocalStorage.setItem(
        "access_token",
        response.data?.session?.access_token ?? ""
      );
      secureLocalStorage.setItem(
        "refresh_token",
        response.data?.session?.refresh_token
      );

      document.cookie = `access_token=${response.data?.session?.access_token}; Path=/; SameSite=Strict;`;
      document.cookie = `refresh_token=${response.data?.session?.refresh_token}; Path=/; SameSite=Strict;`;

      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Paper
        elevation={4}
        sx={{ p: 4, borderRadius: 3, width: "100%", textAlign: "center" }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Login to Insurance Dashboard & Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Login in seconds. No credit card required.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            required
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            disabled={loading}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Login"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 1 }}>
          <span>Forgot password? </span>
          <MuiLink component={Link} href="/forgot-password" underline="hover">
            Reset here
          </MuiLink>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <span>Don&apos;t have an account? </span>
          <MuiLink component={Link} href="/signup" underline="hover">
            Sign up here
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
}
