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
  IconButton,
  TablePagination,
  TableSortLabel,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";
import { useAppContext } from "@/app/context/AppContext";
import { RoleType, UserStatus } from "@/enums";
import { getToastOptions } from "@/utils/getToastOptions";
import { User, Order, Status } from "@/types";
import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "@/redux/slice/UserSlice";
import TableSkeletonLoader from "@/GlobalComponents/TableSkeletonLoader";
import { StyledFabButton } from "@/GlobalComponents/StyledComponent";
import { toTitleCase } from "@/utils/toTileCase";
import { departments, statusList } from "@/utils/constants";

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
  isDialogOpen,
  setIsDialogOpen,
  isEdit,
  setIsEdit,
  currentUserId,
  setCurrentUserId,
  fetchData,
  setFetchData,
}: {
  status: UserStatus;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  apiLoading: boolean;
  setApiLoading: Dispatch<SetStateAction<boolean>>;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  currentUserId: string;
  setCurrentUserId: Dispatch<SetStateAction<string>>;
  fetchData: boolean;
  setFetchData: Dispatch<SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const { userDetails } = useSelector((state: RootState) => state.AUTH);
  const { users, total } = useSelector((state: RootState) => state.USERS);
  const { setLoading, showCatchError } = useAppContext();

  const [page, setPage] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [userList, setUserList] = useState<User[]>(users);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [autoVerify, setAutoVerify] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<keyof User>("created_at");
  const [order, setOrder] = useState<Order>("desc");
  const [userStatus, setUserStatus] = useState<Status | null>(null);

  const handleEdit = (user: User) => {
    setCurrentUserId(user.id);
    setIsEdit(true);
    setIsDialogOpen(true);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setPassword(user.password);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updates: Partial<User> = {
        name,
        email,
        phone,
        ...(userStatus && { status: userStatus?.value }),
      };
      await dispatch(updateUser({ id: currentUserId, updates })).unwrap();
      toast.success("User updated successfully!", getToastOptions());
      refreshData();
    } catch (error) {
      showCatchError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDelete = (user: User) => {
    setCurrentUserId(user.id);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await dispatch(deleteUser(currentUserId)).unwrap();
      toast.success("User deleted successfully!", getToastOptions());
      setFetchData(true);
      setOpenDelete(false);
      setCurrentUserId("");
    } catch (error) {
      showCatchError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create new user with Supabase Auth
  const handleCreate = async () => {
    setLoading(true);
    try {
      // Step 1: Sign up user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;

      const authUser = data.user;
      if (!authUser) throw new Error("Failed to create auth user");

      // Step 2: Add to 'users' table
      await dispatch(
        addUser({
          auth_id: authUser.id,
          name,
          email,
          phone,
          password,
          status: UserStatus.APPROVED,
        })
      ).unwrap();

      toast.success("User created successfully!", getToastOptions());
      handleReset();
      refreshData();
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
              currentUserId: userDetails.id,
            })
          ).unwrap();
          setUserList(response?.data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) handleUpdate();
    else handleCreate();
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setAutoVerify(true);
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

  const refreshData = () => {
    setIsDialogOpen(false);
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
                  {tableHeader.map((headCell) => (
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
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {userList.length > 0 ? (
                  userList.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell align="center">{user.name}</TableCell>
                      <TableCell align="center">{user.email}</TableCell>
                      <TableCell align="center">{user.phone}</TableCell>
                      <TableCell align="center">
                        {toTitleCase(user.status)}
                      </TableCell>
                      <TableCell align="center">
                        {toTitleCase(user?.roles?.name)}
                      </TableCell>
                      <TableCell align="center">
                        {moment(user.created_at).format("DD MMM yyyy")}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" justifyContent="center" gap={1}>
                          <StyledFabButton
                            color="secondary"
                            onClick={() => handleEdit(user)}
                          >
                            <CreateRoundedIcon fontSize="small" />
                          </StyledFabButton>
                          <StyledFabButton color="warning">
                            <InfoRoundedIcon fontSize="small" />
                          </StyledFabButton>
                          {userDetails.role === RoleType.SUPER_ADMIN && (
                            <StyledFabButton
                              color="error"
                              onClick={() => handleOpenDelete(user)}
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
            disabled={userList.length === 0}
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

      {/* ➕ Add / Edit Dialog */}
      <Dialog
        maxWidth="sm"
        fullWidth
        open={isDialogOpen}
        component="form"
        onSubmit={handleSubmit}
      >
        <DialogTitle>{isEdit ? "Update user" : "Add user"}</DialogTitle>
        <IconButton
          onClick={() => setIsDialogOpen(false)}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseRoundedIcon />
        </IconButton>
        <DialogContent dividers>
          <Stack rowGap={3}>
            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              variant="standard"
              focused
            />
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
            <TextField
              fullWidth
              required
              variant="standard"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              required
              disabled={isEdit}
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
                        disabled={isEdit}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {isEdit && (
              <Autocomplete
                fullWidth
                options={statusList.filter((sts) => sts.value !== status)}
                value={userStatus}
                onChange={(_, newValue) => setUserStatus(newValue)}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, selectedValue) =>
                  option.value === selectedValue.value
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required={userStatus === null}
                    label="Status"
                    variant="standard"
                  />
                )}
              />
            )}
            {status === UserStatus.APPROVED && (
              <FormControlLabel
                control={<Checkbox checked />}
                disabled
                label="Mark as verified"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ mt: 2 }}>
          <Button type="button" variant="outlined" onClick={handleReset}>
            Clear
          </Button>
          <Button type="submit" variant="contained">
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🗑️ Delete Dialog */}
      <Dialog open={openDelete}>
        <DialogTitle>Delete user</DialogTitle>
        <DialogContent dividers>
          Are you sure you want to delete this user?
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
