"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { getToastOptions } from "@/utils/getToastOptions";
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
import {
  ChevronLeftRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

export default function SignUpPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", getToastOptions());
      return;
    }
    setLoading(true);
    try {
      const signUpResponse = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpResponse.error) {
        toast.error(
          `Error signing up: ${signUpResponse.error.message}`,
          getToastOptions()
        );
        setLoading(false);
        return;
      }
      const userDetails = signUpResponse.data.user;
      if (!userDetails) {
        toast.error("User details missing after signup.", getToastOptions());
        setLoading(false);
        return;
      }
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", "policy_holder")
        .single();

      if (roleError) {
        toast.error(
          `Error fetching role: ${roleError.message}`,
          getToastOptions()
        );
        setLoading(false);
        return;
      }
      const roleId = roleData?.id;
      if (!roleId) {
        toast.error("Role ID not found.", getToastOptions());
        setLoading(false);
        return;
      }
      const insertResponse = await supabase.from("users").insert([
        {
          id: userDetails.id,
          email: userDetails.email,
          role_id: roleId,
          password,
          name,
          phone,
        },
      ]);
      if (insertResponse.error) {
        toast.error(
          insertResponse.error.message ??
            "An error occurred while saving user data.",
          getToastOptions()
        );
        setLoading(false);
        return;
      }
      toast.success(
        "Confirmation email sent. Please check your inbox.",
        getToastOptions()
      );
      router.push("/login");
    } catch (error) {
      toast.error(
        `Unexpected error: ${(error as Error).message}`,
        getToastOptions()
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Signup to Student Info System
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Signup in seconds. No credit card required.
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
        />
        <TextField
          fullWidth
          required
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
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
          {loading ? <CircularProgress size={22} color="inherit" /> : "Signup"}
        </Button>
        <Box>
          <Button
            LinkComponent={Link}
            variant="text"
            href="/login"
            fullWidth={false}
            startIcon={<ChevronLeftRounded />}
          >
            Go back to login
          </Button>
        </Box>
      </Box>
    </>
  );
}
