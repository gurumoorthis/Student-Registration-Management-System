"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { getToastOptions } from "@/utils/getToastOptions";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthLayout } from "@/GlobalComponents/layout/AuthLayout";
import { useAppContext } from "@/app/context/AppContext";

export default function SignUpPage() {
  const router = useRouter();
  const {
    setLoading,
    setDialogNotificationContent,
    setOpenDialogNotification,
    showCatchError,
  } = useAppContext();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      setToken(params.get("access_token"));
    }
  }, []);
  console.log(token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", getToastOptions());
      return;
    }
    if (!token) {
      toast.error("Invalid or expired reset token.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error(
          `Error resetting password: ${error.message}`,
          getToastOptions()
        );
        setLoading(false);
        return;
      }

      await supabase
        .from("users")
        .update({ password })
        .eq("auth_id", (await supabase.auth.getUser()).data.user?.id);

      setOpenDialogNotification(true);
      setDialogNotificationContent({
        title: "Password Reset Successful",
        content:
          "Your password has been updated successfully. Please login with your new password.",
        isSuccess: true,
      });

      router.push("/management/login");
    } catch (error) {
      showCatchError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Reset Password
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Enter your new password below and confirm it to securely update your
        account access
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <TextField
          fullWidth
          required
          variant="standard"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
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
        <TextField
          fullWidth
          required
          variant="standard"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value.trim())}
          slotProps={{
            htmlInput: {
              minLength: 6,
            },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button fullWidth type="submit" variant="contained" size="large">
          Reset
        </Button>
        <Typography variant="body2" component="span">
          Didn&apos;t get the reset link?{" "}
          <MuiLink
            component={Link}
            href="/management/forgot-password"
            underline="hover"
          >
            Forgot password
          </MuiLink>
        </Typography>
      </Box>
    </AuthLayout>
  );
}
