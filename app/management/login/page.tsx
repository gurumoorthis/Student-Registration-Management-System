"use client";

import { useState } from "react";
import {
  Box,
  Button,
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
import { getUserByAuthId } from "@/redux/slice/AuthSlice";
import { useAppDispatch } from "@/redux/hooks";
import { AuthLayout } from "@/GlobalComponents/layout/AuthLayout";
import { useAppContext } from "@/app/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setLoading, showCatchError } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);

      if (response.error || !response.data.user) {
        toast.error(
          response.error?.message ?? ERROR_MESSAGES.GENERIC,
          getToastOptions()
        );
        return;
      }

      const userAuth = response.data.user;

      // Fetch user details from your table
      const payload = await dispatch(getUserByAuthId(userAuth.id)).unwrap();
      if (payload?.status !== "APPROVED") {
        toast.error(
          `Your account is ${payload?.status} status. Contact Management.`,
          getToastOptions()
        );
        return;
      }

      // Store tokens and user info
      secureLocalStorage.setItem(
        "access_token",
        response.data?.session?.access_token ?? ""
      );
      secureLocalStorage.setItem(
        "refresh_token",
        response.data?.session?.refresh_token ?? ""
      );
      document.cookie = `role=${payload.roles?.name}; Path=/; SameSite=Strict;`;
      document.cookie = `access_token=${response.data?.session?.access_token}; Path=/; SameSite=Strict;`;
      document.cookie = `refresh_token=${response.data?.session?.refresh_token}; Path=/; SameSite=Strict;`;

      toast.success("Login success", getToastOptions());
      setTimeout(() => router.push("/management/dashboard"), 2000);
    } catch (error) {
      showCatchError(error as Error);
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
        className="flex flex-col gap-5"
      >
        <TextField
          fullWidth
          required
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          slotProps={{
            htmlInput: {
              minLength: 6,
            },
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
        <Button fullWidth type="submit" variant="contained" size="large">
          Login
        </Button>
        <Box className="flex flex-col gap-1">
          <Typography variant="body2" component="span">
            Forgot password?{" "}
            <MuiLink
              component={Link}
              href="/management/forgot-password"
              underline="hover"
            >
              Reset here
            </MuiLink>
          </Typography>
          <Typography variant="body2" component="span">
            Don&apos;t have an account?{" "}
            <MuiLink
              component={Link}
              href="/management/signup"
              underline="hover"
            >
              Sign up here
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
}
