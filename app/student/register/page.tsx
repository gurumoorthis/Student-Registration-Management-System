"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Container,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { getToastOptions } from "@/utils/getToastOptions";
import { FormTitle } from "@/GlobalComponents/FormTitle";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useAppContext } from "../../context/AppContext";

interface Department {
  id: string;
  name: string;
}

export default function StudentForm() {
  const { loading, setLoading } = useAppContext();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [gender, setGender] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  useEffect(() => {
    // Fetch departments from Supabase
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("departments").select("*");
      if (!error && data) setDepartments(data);
    };
    fetchDepartments();
  }, []);

  const validateForm = () => {
    if (
      !name ||
      !email ||
      !phone ||
      !dob ||
      !address ||
      !departmentId ||
      !gender ||
      !parentName ||
      !parentContact ||
      !bloodGroup
    ) {
      toast.error("All fields are required", getToastOptions());
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const { error } = await supabase.from("students").insert([
      {
        name,
        email,
        phone,
        dob,
        address,
        department_id: departmentId,
        gender,
        parent_name: parentName,
        parent_contact: parentContact,
        blood_group: bloodGroup,
      },
    ]);

    setLoading(false);

    if (error) {
      toast.error(error.message, getToastOptions());
    } else {
      setOpenSuccessDialog(true);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setDob("");
      setAddress("");
      setDepartmentId("");
      setGender("");
      setParentName("");
      setParentContact("");
      setBloodGroup("");
    }
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  return (
    <Box className="flex min-h-dvh items-center overflow-y-auto">
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Paper
          elevation={4}
          component={Stack}
          sx={{ p: 4, borderRadius: 3 }}
          rowGap={3.5}
        >
          <Typography variant="h5" fontWeight="bold">
            🎓 College Admission Form
          </Typography>
          <Stack component="form" onSubmit={handleSubmit} rowGap={4}>
            {/* ===== Basic Student Details ===== */}
            <Stack rowGap={2}>
              <FormTitle title="Basic Student Details" />
              <Grid container spacing={4}>
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
                    label="Date of Birth"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                    required
                    fullWidth
                    variant="standard"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup
                      row
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="other"
                        control={<Radio />}
                        label="Other"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Blood Group"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    required
                    fullWidth
                    variant="standard"
                  />
                </Grid>
              </Grid>
            </Stack>
            <Stack rowGap={2}>
              <FormTitle title="Contact Details" />
              <Grid container spacing={2}>
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
            </Stack>
            {/* ===== Academic Information ===== */}
            <Stack rowGap={2}>
              <FormTitle title="Academic Information" />
              <Grid container spacing={2}>
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
                  <TextField
                    label="Previous School/College"
                    fullWidth
                    variant="standard"
                  />
                </Grid>
              </Grid>
            </Stack>
            {/* ===== Parent / Guardian Details ===== */}
            <Stack rowGap={2}>
              <FormTitle title="Parent / Guardian Details" />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Parent/Guardian Name"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    required
                    fullWidth
                    variant="standard"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Parent/Guardian Contact"
                    value={parentContact}
                    onChange={(e) => setParentContact(e.target.value)}
                    required
                    fullWidth
                    variant="standard"
                  />
                </Grid>
              </Grid>
            </Stack>
            {/* ===== Submit ===== */}
            <Button type="submit" variant="contained" size="large">
              Submit
            </Button>
          </Stack>
        </Paper>
      </Container>
      <Dialog open={openSuccessDialog}>
        <DialogTitle variant="h6" fontWeight="bold">
          Success
        </DialogTitle>
        <IconButton onClick={handleCloseSuccessDialog}>
          <CloseRoundedIcon />
        </IconButton>
        <DialogContent dividers>
          <Stack direction="row" columnGap={1}>
            <CheckCircleOutlineRoundedIcon color="success" />
            <DialogContentText id="alert-dialog-description" color="success">
              Congratulations! Your admission form has been submitted. We will
              contact you soon.
            </DialogContentText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseSuccessDialog}
            autoFocus
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
