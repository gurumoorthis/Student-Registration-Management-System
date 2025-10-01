"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
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
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import { toast } from "sonner";
import { getToastOptions } from "@/utils/getToastOptions";
import { useAppContext } from "../../context/AppContext";
import { departments } from "@/utils/constants";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import FormTitle from "@/GlobalComponents/FormTitle";
import { Department, Gender } from "@/types";
import SectionDivider from "@/GlobalComponents/SectionDivider";
import { addStudent } from "@/redux/slice/StudentSlice";
import { useAppDispatch } from "@/redux/hooks";

export default function StudentForm() {
  const {
    setLoading,
    setOpenDialogNotification,
    setDialogNotificationContent,
    showCatchError,
  } = useAppContext();
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState<Department | null>(null);
  const [gender, setGender] = useState<Gender>("");
  const [parentName, setParentName] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

  const validateForm = () => {
    if (
      !name ||
      !email ||
      !phone ||
      !dob ||
      !address ||
      !department ||
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
    try {
      await dispatch(
        addStudent({
          name,
          email,
          phone,
          dob,
          address,
          department: department?.value || "",
          gender,
          parent_name: parentName,
          parent_contact: parentContact,
          blood_group: bloodGroup,
        })
      ).unwrap();

      // If success
      setOpenDialogNotification(true);
      setDialogNotificationContent({
        title: "Admission Form Submitted",
        content:
          "Congratulations! Your admission form has been submitted successfully. " +
          "We’ll contact you soon with the next steps.",
        isSuccess: true,
      });

      handleReset();
    } catch (error) {
      showCatchError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setDob("");
    setAddress("");
    setDepartment(null);
    setGender("");
    setParentName("");
    setParentContact("");
    setBloodGroup("");
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
          <Stack direction="row" gap={1.5} alignItems="center">
            <SchoolRoundedIcon color="primary" fontSize="large" />
            <Typography variant="h5" fontWeight="bold">
              College Admission Form
            </Typography>
          </Stack>
          <Stack component="form" onSubmit={handleSubmit} rowGap={4}>
            <Stack rowGap={5} divider={<SectionDivider />}>
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
                        onChange={(e) => setGender(e.target.value as Gender)}
                      >
                        <FormControlLabel
                          value="Male"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="Female"
                          control={<Radio />}
                          label="Female"
                        />
                        <FormControlLabel
                          value="Other"
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
                      slotProps={{
                        htmlInput: {
                          maxLength: 10,
                          minLength: 10,
                        },
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography>+91</Typography>
                            </InputAdornment>
                          ),
                        },
                      }}
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
                    <Autocomplete
                      fullWidth
                      options={departments}
                      value={department}
                      onChange={(_, newValue) => setDepartment(newValue)}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.value === selectedValue.value
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required={department === null}
                          label="Department"
                          variant="standard"
                        />
                      )}
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
                      slotProps={{
                        htmlInput: {
                          maxLength: 10,
                          minLength: 10,
                        },
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography>+91</Typography>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Stack>
            {/* ===== Submit ===== */}
            <Stack
              direction="row"
              gap={1.5}
              alignItems="center"
              justifyContent="end"
            >
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={handleReset}
              >
                Clear
              </Button>
              <Button type="submit" variant="contained" size="large">
                Submit
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
