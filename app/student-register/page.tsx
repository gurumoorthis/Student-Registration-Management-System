"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  Paper,
  Container,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { getToastOptions } from "@/utils/getToastOptions";
import { AuthLayout } from "@/GlobalComponents/layout/AuthLayout";

interface Department {
  id: string;
  name: string;
}

export default function StudentForm() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch departments from Supabase
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("departments").select("*");
      if (!error && data) setDepartments(data);
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !dob || !address || !departmentId) {
      return toast.error("All fields are required", getToastOptions());
    }

    setLoading(true);

    const { data, error } = await supabase.from("students").insert([
      {
        name,
        email,
        phone,
        dob,
        address,
        department_id: departmentId,
      },
    ]);

    setLoading(false);

    if (error) {
      toast.error(error.message, getToastOptions());
    } else {
      toast.success("Student registered successfully", getToastOptions());
      setName("");
      setEmail("");
      setPhone("");
      setDob("");
      setAddress("");
      setDepartmentId("");
    }
  };

  return (
    <Box className="flex h-screen items-center">
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <Typography variant="h6" fontWeight="bold">
              Register New Student
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  variant="standard"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  variant="standard"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  fullWidth
                  variant="standard"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  required
                  fullWidth
                  variant="standard"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Department"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                  fullWidth
                  variant="standard"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Gender
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  multiline
                  fullWidth
                  rows={2}
                  variant="standard"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Register Student"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
