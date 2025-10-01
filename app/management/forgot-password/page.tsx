"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link as MuiLink,
  Stack,
} from "@mui/material";
import Link from "next/link";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { AuthLayout } from "@/GlobalComponents/layout/AuthLayout";
import { useAppContext } from "@/app/context/AppContext";
import { getToastOptions } from "@/utils/getToastOptions";

export default function LoginPage() {
  const { setLoading, showCatchError } = useAppContext();
  const [email, setEmail] = useState("");
  const [showTimer, setShowTimer] = useState(0);

  useEffect(() => {
    if (showTimer > 0) {
      const interval = setInterval(() => {
        setShowTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/management/reset-password`,
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success(
        "Password reset link sent! Check your email to reset your password.",
        getToastOptions()
      );
      setShowTimer(30);
    } catch (error) {
      showCatchError(error as Error);
    }
  };
  return (
    <AuthLayout>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Forgot Password
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Enter the email address associated with your account, and we’ll send you
        a reset link.
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
        {showTimer > 0 ? (
          <Stack>
            <Typography variant="body2" component="span">
              You can resend in{" "}
              <Typography component="span" variant="body2" color="primary">
                {`${showTimer} second${showTimer >= 10 ? "s" : ""}`}
              </Typography>
            </Typography>
          </Stack>
        ) : (
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={showTimer > 0}
          >
            Send Link
          </Button>
        )}
        <Typography variant="body2" component="span">
          Remember your password?{" "}
          <MuiLink component={Link} href="/management/login" underline="hover">
            Login
          </MuiLink>
        </Typography>
      </Box>
    </AuthLayout>
  );
}
