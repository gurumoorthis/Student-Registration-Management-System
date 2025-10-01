"use client";

import {
  Paper,
  Stack,
  Typography,
  Grid,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Autocomplete,
  IconButton,
  Tab,
  Skeleton,
} from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { TextField, Button, FormControl } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { toast } from "sonner";
import { useAppContext } from "@/app/context/AppContext";
import { UserStatus } from "@/enums";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { getToastOptions } from "@/utils/getToastOptions";
import { departments } from "@/utils/constants";
import { Department, Gender, User } from "@/types";
import {
  addStudent,
  deleteStudent,
  updateStudent,
} from "@/redux/slice/StudentSlice";
import { StyledFabButton } from "@/GlobalComponents/StyledComponent";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import UsersTableView from "@/GlobalComponents/Users/UserTableView";

export default function Users() {
  const dispatch = useAppDispatch();
  const { setLoading, showCatchError } = useAppContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState("");
  const [fetchData, setFetchData] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
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
  const [isLoading, setIsLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(true);

  const [value, setValue] = useState(UserStatus.APPROVED);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue as UserStatus);
    setFetchData(true);
  };

  const handleAdd = () => {
    setIsDialogOpen(true);
    setIsEdit(false);
    setCurrentStudentId("");
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updates: Partial<User> = {
        name,
        email,
        phone,
        dob,
        address,
        department: department?.value,
        gender,
        parent_name: parentName,
        parent_contact: parentContact,
        blood_group: bloodGroup,
      };
      await dispatch(updateStudent({ id: currentStudentId, updates })).unwrap();
      toast.success("User updated successfully!", getToastOptions());
      refreshData();
    } catch (error) {
      showCatchError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await dispatch(deleteStudent(currentStudentId)).unwrap();
      toast.success("User deleted successfully!", getToastOptions());
      setFetchData(true);
      setOpenDelete(false);
      setCurrentStudentId("");
    } catch (error) {
      showCatchError(error as Error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreate = async () => {
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
      toast.success("User created successfully", getToastOptions());
      handleReset();
    } catch (error) {
      showCatchError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    handleReset();
    setFetchData(true);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      handleUpdate();
    } else {
      handleCreate();
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
    <Paper sx={{ borderRadius: 3 }} component={Stack} className="flex-1">
      <Stack sx={{ flex: 1 }}>
        <TabContext value={value}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            sx={{ borderBottom: 1, borderColor: "divider", pr: 1 }}
          >
            {isLoading ? (
              <Stack
                direction="row"
                alignItems="center"
                gap={3}
                justifyContent="space-between"
                flex={1}
                py={1.13}
                pl={1}
                pr={0.5}
              >
                <Stack direction="row" gap={2} pl={1}>
                  {Array.from({ length: 3 }, (_, i) => (
                    <Skeleton key={i} variant="text" width={60} height={20} />
                  ))}
                </Stack>
                {value !== UserStatus.REJECTED && (
                  <Skeleton variant="circular" width={30} height={30} />
                )}
              </Stack>
            ) : (
              <>
                <TabList onChange={handleChange}>
                  <Tab label="Approved" value={UserStatus.APPROVED} />
                  <Tab label="Waiting" value={UserStatus.WAITING} />
                  <Tab label="Rejected" value={UserStatus.REJECTED} />
                </TabList>
                {value !== UserStatus.REJECTED && (
                  <StyledFabButton color="primary" onClick={handleAdd}>
                    <AddRoundedIcon fontSize="small" />
                  </StyledFabButton>
                )}
              </>
            )}
          </Stack>
          <TabPanel
            value={UserStatus.APPROVED}
            sx={{ flex: 1, p: 0 }}
            className="flex flex-col"
          >
            <UsersTableView
              status={value}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              apiLoading={apiLoading}
              setApiLoading={setApiLoading}
            />
          </TabPanel>
          <TabPanel
            value={UserStatus.WAITING}
            sx={{ flex: 1, p: 0 }}
            className="flex flex-col"
          >
            <UsersTableView
              status={value}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              apiLoading={apiLoading}
              setApiLoading={setApiLoading}
            />
          </TabPanel>
          <TabPanel
            value={UserStatus.REJECTED}
            sx={{ flex: 1, p: 0 }}
            className="flex flex-col"
          >
            <UsersTableView
              status={value}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              apiLoading={apiLoading}
              setApiLoading={setApiLoading}
            />
          </TabPanel>
        </TabContext>
      </Stack>

      {/* Add / Edit Dialog */}
      <Dialog
        maxWidth="md"
        open={isDialogOpen}
        component="form"
        onSubmit={handleSubmit}
      >
        <DialogTitle>{isEdit ? "Update student" : "Add student"}</DialogTitle>
        <IconButton
          onClick={() => setIsDialogOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
        <DialogContent dividers>
          {/* ===== Basic User Details ===== */}
          <Grid container spacing={3}>
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
        </DialogContent>
        <DialogActions sx={{ mt: 2 }}>
          <Button
            type="button"
            variant="outlined"
            size="large"
            onClick={handleReset}
          >
            Clear
          </Button>
          <Button type="submit" variant="contained" size="large">
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete}>
        <DialogTitle>Delete student</DialogTitle>
        <DialogContent dividers>
          Are you sure you want to delete this student?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} variant="outlined">
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
