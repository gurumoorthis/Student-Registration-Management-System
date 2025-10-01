"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  TablePagination,
  TableSortLabel,
  Box,
  Tab,
} from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { TextField, Button, FormControl } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import moment from "moment";
import { toast } from "sonner";
import { useAppContext } from "@/app/context/AppContext";
import { RoleType, UserStatus } from "@/enums";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { getToastOptions } from "@/utils/getToastOptions";
import { departments } from "@/utils/constants";
import { Department, Gender, Order, User } from "@/types";
import {
  addStudent,
  deleteStudent,
  fetchStudents,
  updateStudent,
} from "@/redux/slice/StudentSlice";
import TableSkeletonLoader from "@/GlobalComponents/TableSkeletonLoader";
import { StyledFabButton } from "@/GlobalComponents/StyledComponent";
import { fetchUsers } from "@/redux/slice/UserSlice";
import { toTitleCase } from "@/utils/toTileCase";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const tableHeader = [
  { label: "S.No", key: "sno", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Phone", key: "phone", sortable: true },
  { label: "Status", key: "status", sortable: true },
  { label: "Role", key: "role_id", sortable: true },
  { label: "Created At", key: "created_at", sortable: true },
  { label: "Actions", key: "actions", sortable: false },
];

export default function UsersTableView({
  status,
  isLoading,
  setIsLoading,
  apiLoading,
  setApiLoading,
}: {
  status: UserStatus;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  apiLoading: boolean;
  setApiLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const { userDetails } = useSelector((state: RootState) => state.AUTH);
  const { users, total } = useSelector((state: RootState) => state.USERS);
  const { setLoading, showCatchError } = useAppContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState("");
  const [fetchData, setFetchData] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [studentList, setStudentList] = useState<User[]>(users);
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<keyof User>("created_at");
  const [order, setOrder] = useState<Order>("desc");

  const handleEdit = (student: User) => {
    setCurrentStudentId(student.id);
    setIsEdit(true);
    setIsDialogOpen(true);
    setName(student.name || "");
    setEmail(student.email || "");
    setPhone(student.phone || "");
    setDob(student.dob || "");
    setAddress(student.address || "");
    setDepartment(
      student.department
        ? departments.find((d) => d.value === student.department) || null
        : null
    );
    setGender(student.gender || "");
    setParentName(student.parent_name || "");
    setParentContact(student.parent_contact || "");
    setBloodGroup(student.blood_group || "");
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

  const handleOpenDelete = (student: User) => {
    setCurrentStudentId(student.id);
    setOpenDelete(true);
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

  useEffect(() => {
    if (fetchData) {
      const loadData = async () => {
        setApiLoading(true);
        try {
          const response = await dispatch(
            fetchUsers({
              page: page + 1,
              limit: rowsPerPage,
              sortBy,
              order,
              status,
            })
          ).unwrap();
          setStudentList(response?.data);
        } catch (error) {
          showCatchError(error as Error);
        } finally {
          setApiLoading(false);
          setFetchData(false);
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [dispatch, fetchData, page, rowsPerPage, sortBy, order, status]);

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setFetchData(true);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setFetchData(true);
  };

  const handleColumnSort = (orderBy: string) => {
    setSortBy(orderBy as keyof User);
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setFetchData(true);
  };

  return (
    <Paper sx={{ borderRadius: 3 }} component={Stack} className="flex-1">
      {isLoading || apiLoading ? (
        <TableSkeletonLoader rows={5} columns={5} />
      ) : (
        <Stack sx={{ flex: 1 }}>
          <TableContainer sx={{ flex: 1 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {tableHeader.map((headCell) => {
                    return (
                      <TableCell
                        key={headCell.key}
                        sx={{
                          backgroundColor: "#c1c9d0bf",
                          fontWeight: "600",
                        }}
                        align="center"
                      >
                        {headCell.sortable ? (
                          <TableSortLabel
                            active={sortBy === headCell.key}
                            direction={sortBy === headCell.key ? order : "asc"}
                            onClick={() => handleColumnSort(headCell.key)}
                          >
                            <Typography
                              noWrap
                              fontWeight="bold"
                              variant="subtitle2"
                            >
                              {headCell.label}
                            </Typography>
                          </TableSortLabel>
                        ) : (
                          <Typography
                            noWrap
                            fontWeight="bold"
                            variant="subtitle2"
                          >
                            {headCell.label}
                          </Typography>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {studentList.length > 0 ? (
                  studentList.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell align="center">
                        <Typography noWrap variant="subtitle2">
                          {student.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography noWrap variant="subtitle2">
                          {student.email}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography noWrap variant="subtitle2">
                          {student.phone}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography noWrap variant="subtitle2">
                          {toTitleCase(student.status)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography noWrap variant="subtitle2">
                          {toTitleCase(student?.roles?.name)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography noWrap variant="subtitle2">
                          {student.created_at &&
                            moment(student.created_at).format("DD MMM yyyy")}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" justifyContent="center" gap={1}>
                          <StyledFabButton
                            color="secondary"
                            onClick={() => handleEdit(student)}
                          >
                            <CreateRoundedIcon fontSize="small" />
                          </StyledFabButton>
                          <StyledFabButton
                            color="warning"
                            // onClick={() => handleOpenDelete(student)}
                          >
                            <InfoRoundedIcon fontSize="small" />
                          </StyledFabButton>
                          {userDetails.role === RoleType.SUPER_ADMIN && (
                            <StyledFabButton
                              color="error"
                              onClick={() => handleOpenDelete(student)}
                            >
                              <DeleteRoundedIcon fontSize="small" />
                            </StyledFabButton>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={tableHeader.length} align="center">
                      <Typography fontWeight="bold" variant="h6">
                        No data found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            disabled={studentList.length === 0}
            rowsPerPageOptions={[10, 20, 40]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              backgroundColor: "#c1c9d0bf",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
            }}
          />
        </Stack>
      )}
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
