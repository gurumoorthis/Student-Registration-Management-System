"use client";

import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
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
import { AuthLayout } from "@/GlobalComponents/layout/AuthLayout";

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
    <AuthLayout>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Login to the Student Admission System
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Login to access the admission dashboard
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5"
      >
        <TextField
          fullWidth
          required
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          variant="standard"
        />
        <TextField
          fullWidth
          required
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          variant="standard"
          onChange={(e) => setPassword(e.target.value.trim())}
          disabled={loading}
          slotProps={{
            input: {
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
            },
          }}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Login"}
        </Button>
        <Box className="flex flex-col gap-1">
          <Typography variant="body2" component="span">
            Forgot password?{" "}
            <MuiLink component={Link} href="/forgot-password" underline="hover">
              Reset here
            </MuiLink>
          </Typography>
          {/* <Typography variant="body2" component="span">
            Don&apos;t have an account?{" "}
            <MuiLink component={Link} href="/signup" underline="hover">
              Sign up here
            </MuiLink>
          </Typography> */}
        </Box>
      </Box>
    </AuthLayout>
  );
}
