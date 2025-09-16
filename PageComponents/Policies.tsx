"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { useAppDispatch } from "@/redux/hooks";
import {
  addPolicy,
  getPolicies,
  getUserPolicies,
  updatePolicy,
  type UserPolicyProps,
  type Policy,
  deletePolicy,
  getPoliciesByAgent,
  getPoliciesByAdmin,
  getClientsByAgent,
} from "@/redux/slice/PolicySlice";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import moment from "moment";
import { toast } from "sonner";
import { useAppContext } from "@/app/context/AppContext";
import { Role } from "@/enums";
import { getAllUsers, type User } from "@/redux/slice/AuthSlice";
import PageTitle from "@/GlobalComponents/PageTitle";

export default function Policies() {
  const userId = secureLocalStorage.getItem("user_id") as string;
  const dispatch = useAppDispatch();
  const { policies, totalPolicyCount, userPolicies } = useSelector(
    (state: RootState) => state.POLICY
  );
  const { userDetails, userList } = useSelector(
    (state: RootState) => state.AUTH
  );
  const { setLoading } = useAppContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState<Partial<Policy>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isEdit, setIsEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [activePolicy, setActivePolicy] = useState(0);
  const [agentClients, setAgentClients] = useState<User[]>([]);
  const [clientUserId, setClientUserId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit) {
        await dispatch(
          updatePolicy({
            id: activePolicy,
            status: formState.status ?? "",
            user_id: clientUserId,
            policy_id: formState.id ?? 0,
          })
        ).unwrap();
      } else {
        await dispatch(
          addPolicy({
            user_id: clientUserId,
            policy_id: formState.id ?? 0,
          })
        ).unwrap();
      }
      setIsDialogOpen(false);
      setFormState({});
      setClientUserId("");
    } catch (error) {
      toast.error("Failed to save policy");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (policy: UserPolicyProps) => {
    setFormState({ ...policy.policies, status: policy.status });
    setIsDialogOpen(true);
    setIsEdit(true);
    setActivePolicy(policy.id);
    setClientUserId(policy.user_id);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await dispatch(deletePolicy(activePolicy)).unwrap();
      toast.success("Policy deleted");
    } catch {
      toast.error("Failed to delete policy");
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (userDetails.roles?.name === Role.POLICY_HOLDER) {
        await dispatch(
          getUserPolicies({
            user_id: userId,
            page: currentPage + 1,
            limit: rowsPerPage,
          })
        );
      } else if (userDetails.roles?.name === Role.AGENT) {
        await dispatch(
          getPoliciesByAgent({
            agent_id: userId,
            page: currentPage + 1,
            limit: rowsPerPage,
          })
        );
      } else {
        await dispatch(
          getPoliciesByAdmin({ page: currentPage + 1, limit: rowsPerPage })
        );
      }
      setIsLoading(false);
    };
    if (userId) fetchData();
  }, [dispatch, userId, currentPage, rowsPerPage, userDetails.roles?.name]);

  useEffect(() => {
    if (userId) dispatch(getAllUsers());
  }, [dispatch, userId]);

  useEffect(() => {
    if (userList) setAgentClients(userList);
  }, [userList]);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <PageTitle title="Policies" />
        {userDetails.roles?.name !== Role.POLICY_HOLDER && (
          <Button variant="contained" onClick={() => setIsDialogOpen(true)}>
            Add Policy
          </Button>
        )}
      </div>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Coverage</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userPolicies.map((policy, index) => (
                <TableRow key={policy.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{policy.policies?.name}</TableCell>
                  <TableCell>{policy.policies?.policy_number}</TableCell>
                  <TableCell>{policy.policies?.type}</TableCell>
                  <TableCell>{policy.status}</TableCell>
                  <TableCell>${policy.policies?.coverage}</TableCell>
                  <TableCell>${policy.policies?.premium}</TableCell>
                  <TableCell>
                    {`${moment(policy.policies?.start_date).format(
                      "MMM YYYY"
                    )} - ${moment(policy.policies?.end_date).format(
                      "MMM YYYY"
                    )}`}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="warning"
                      onClick={() => handleEdit(policy)}
                    >
                      <Edit />
                    </IconButton>
                    {userDetails.roles?.name === Role.ADMIN && (
                      <IconButton
                        color="error"
                        onClick={() => {
                          setActivePolicy(policy.id);
                          setOpenDelete(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={totalPolicyCount * rowsPerPage}
                  page={currentPage}
                  rowsPerPage={rowsPerPage}
                  onPageChange={(_, newPage) => setCurrentPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setCurrentPage(0);
                  }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>{isEdit ? "Update Policy" : "Add Policy"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl fullWidth>
              <InputLabel>Policy</InputLabel>
              <Select
                required
                value={formState.id?.toString() ?? ""}
                onChange={(e) => {
                  const selectedPolicy = policies.find(
                    (p) => p.id === Number(e.target.value)
                  );
                  setFormState({ ...formState, ...selectedPolicy });
                }}
              >
                {policies.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {userDetails.roles?.name !== Role.POLICY_HOLDER && (
              <FormControl fullWidth>
                <InputLabel>Policyholder</InputLabel>
                <Select
                  required
                  value={clientUserId}
                  onChange={(e) => setClientUserId(e.target.value)}
                >
                  {agentClients.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <TextField
              label="Number"
              value={formState.policy_number ?? ""}
              disabled
            />
            <TextField label="Type" value={formState.type ?? ""} disabled />
            <TextField
              label="Duration"
              value={
                formState.start_date && formState.end_date
                  ? `${moment(formState.start_date).format(
                      "DD/MM/YYYY"
                    )} - ${moment(formState.end_date).format("DD/MM/YYYY")}`
                  : ""
              }
              disabled
            />
            <TextField
              label="Coverage"
              value={formState.coverage ?? ""}
              disabled
            />
            <TextField
              label="Premium"
              value={formState.premium ?? ""}
              disabled
            />

            {isEdit && (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  required
                  value={formState.status ?? ""}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="lapsed">Lapsed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Policy</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this policy?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
