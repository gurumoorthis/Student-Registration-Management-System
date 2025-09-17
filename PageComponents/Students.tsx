"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  Stack,
  Typography,
  Fab,
} from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Box,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Popover from "@mui/material/Popover";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { useAppDispatch } from "@/redux/hooks";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import moment from "moment";
import { toast } from "sonner";
import { useAppContext } from "@/app/context/AppContext";
import { Role } from "@/enums";
import {
  deleteUser,
  getAllRoles,
  getAllUsers,
  type User,
} from "@/redux/slice/AuthSlice";
import { toTitleCase } from "@/utils/toTileCase";
import { supabase } from "@/supabaseClient";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function Students() {
  const userId = secureLocalStorage.getItem("user_id") as string;
  const dispatch = useAppDispatch();
  const { totalPolicyCount, userPolicies } = useSelector(
    (state: RootState) => state.POLICY
  );
  const { roles, userDetails } = useSelector((state: RootState) => state.AUTH);
  const { setLoading } = useAppContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [fetchData, setFetchData] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [userList, setUserList] = useState<User[]>([{ id: 1 }]);
  const [policyHolderUserList, setPolicyHolderUserList] = useState<User[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const toggleValue = (val: string) => {
    if (values.includes(val)) {
      setValues(values.filter((v) => v !== val));
    } else {
      setValues([...values, val]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            name: formState.name,
            email: formState.email,
            phone: formState.phone,
            password: formState.password,
            role_id: formState.role_id,
          })
          .eq("id", formState.id);
        if (updateError) {
          toast.error(updateError.message);
          setLoading(false);
          return;
        }
        toast.success("User updated successfully!");
      } else {
        const signUpRes = await supabase.auth.signUp({
          email: formState.email ?? "",
          password: formState.password ?? "",
        });

        if (signUpRes.error || !signUpRes.data.user) {
          toast.error(
            signUpRes.error?.message || "Error creating user account."
          );
          setLoading(false);
          return;
        }
        const userId = signUpRes.data?.user?.id;
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: userId,
            name: formState.name,
            email: formState.email,
            phone: formState.phone,
            password: formState.password,
            role_id: formState.role_id,
          },
        ]);
        if (insertError) {
          toast.error(insertError.message);
          setLoading(false);
          return;
        }
        toast.success("User created successfully!");
      }
      setIsDialogOpen(false);
      setFormState({});
      setFetchData(true);
    } catch (err) {
      toast.error(`Unexpected error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormState({});
    setIsDialogOpen(true);
    setIsEdit(false);
  };

  const handleEdit = (user: User) => {
    setFormState({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role_id: user.roles.id,
    });
    setIsEdit(true);
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setFormState(user);
    setOpenDelete(true);
  };

  const handleDelete = () => {
    setLoading(true);
    dispatch(deleteUser(formState.id ?? ""))
      .unwrap()
      .then(() => {
        setFetchData(true);
        setOpenDelete(false);
        setFormState({});
      })
      .catch(() => {
        toast.error("Failed to delete user");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (userId && fetchData) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const users = await dispatch(getAllUsers()).unwrap();
          setUserList(users);
        } catch (error) {
          console.error("Failed to fetch users:", error);
        } finally {
          setIsLoading(false);
          setFetchData(false);
        }
      };
      loadData();
    }
  }, [dispatch, userId, fetchData]);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        await dispatch(getAllRoles());
        try {
          const users = await dispatch(
            getAllUsers(Role.POLICY_HOLDER)
          ).unwrap();
          setPolicyHolderUserList(users);
        } catch (error) {
          console.error("Failed to fetch users:", error);
        }
      };
      fetchData();
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (roles.length > 0) {
      const defaultRole = roles.find(
        (role) => role.name === Role.POLICY_HOLDER
      );
      setFormState((prev) => ({ ...prev, role_id: defaultRole?.id }));
    }
  }, [roles]);

  return (
    <Paper sx={{ p: 2 }}>
      <Stack rowGap={1}>
        <Stack direction="row" justifyContent="end">
          <Fab size="small" color="primary" onClick={() => handleEdit(user)}>
            <AddRoundedIcon fontSize="small" />
          </Fab>
        </Stack>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f7f7f7" }}>
              <TableRow>
                <TableCell sx={{ px: 1, py: 1.5 }}>S.No</TableCell>
                <TableCell align="center" sx={{ px: 1, py: 1.5 }}>
                  Name
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 1.5 }}>
                  Email
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 1.5 }}>
                  Phone
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 1.5 }}>
                  Password
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 1.5 }}>
                  Role
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 1.5 }}>
                  Created Date
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 1.5 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell align="center">{user.name}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.phone}</TableCell>
                  <TableCell align="center">{user.password}</TableCell>
                  <TableCell align="center">
                    {toTitleCase(user.roles?.name ?? "")}
                  </TableCell>
                  <TableCell align="center">
                    {moment(user.created_at).format("DD MMM yyyy")}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" gap={1}>
                      <Fab
                        size="small"
                        color="secondary"
                        onClick={() => handleEdit(user)}
                      >
                        <CreateRoundedIcon fontSize="small" />
                      </Fab>
                      <Fab
                        size="small"
                        color="warning"
                        onClick={() => handleOpenDelete(user)}
                      >
                        <InfoRoundedIcon fontSize="small" />
                      </Fab>
                      {userDetails.roles?.name === Role.ADMIN && (
                        <Fab
                          size="small"
                          color="error"
                          onClick={() => handleOpenDelete(user)}
                        >
                          <DeleteRoundedIcon fontSize="small" />
                        </Fab>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {userList.length === 0 ? (
                    <Typography>No data found</Typography>
                  ) : (
                    <Pagination
                      count={totalPolicyCount}
                      page={currentPage}
                      onChange={(_, page) => setCurrentPage(page)}
                    />
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        {/* Add / Edit Dialog */}
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>{isEdit ? "Update User" : "Add User"}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="dense"
                label="Name"
                required
                value={formState.name ?? ""}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="dense"
                label="Email"
                type="email"
                required
                value={formState.email ?? ""}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="dense"
                label="Phone"
                required
                inputProps={{ maxLength: 10 }}
                value={formState.phone ?? ""}
                onChange={(e) =>
                  setFormState({ ...formState, phone: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="dense"
                label="Password"
                type="password"
                required
                inputProps={{ maxLength: 6 }}
                value={formState.password ?? ""}
                onChange={(e) =>
                  setFormState({ ...formState, password: e.target.value })
                }
              />

              {userDetails.roles?.name === Role.ADMIN && (
                <FormControl fullWidth margin="dense">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formState.role_id?.toString() ?? ""}
                    onChange={(e) =>
                      setFormState({ ...formState, role_id: e.target.value })
                    }
                  >
                    {roles?.map((role) => (
                      <MenuItem key={role.id} value={String(role.id)}>
                        {toTitleCase(role.name)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Agent Clients Multi-Select */}
              {formState.role_id ===
                roles.find((role) => role.name === Role.AGENT)?.id && (
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    Select Agent Clients
                  </Button>
                  <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                    {values.map((val) => (
                      <Chip
                        key={val}
                        label={
                          policyHolderUserList.find((f) => f.id === val)
                            ?.name ?? val
                        }
                        onDelete={() => toggleValue(val)}
                      />
                    ))}
                  </Box>
                  <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <Box p={2}>
                      {policyHolderUserList.map((user) => (
                        <Box
                          key={user.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            p: 1,
                          }}
                          onClick={() => toggleValue(user.id)}
                        >
                          <span>{user.name}</span>
                          {values.includes(user.id) && <span>✔</span>}
                        </Box>
                      ))}
                    </Box>
                  </Popover>
                </Box>
              )}

              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained">
                  {isEdit ? "Update" : "Add"}
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this user?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Paper>
  );
}
