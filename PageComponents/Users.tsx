"use client";

import { Paper, Stack, Tab, Skeleton } from "@mui/material";
import { useState } from "react";
import { UserStatus } from "@/enums";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { StyledFabButton } from "@/GlobalComponents/StyledComponent";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import UsersTableView from "@/GlobalComponents/Users/UserTableView";

export default function Users() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [fetchData, setFetchData] = useState(true);
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
    setCurrentUserId("");
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
                {value === UserStatus.APPROVED && (
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
                {value === UserStatus.APPROVED && (
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
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              currentUserId={currentUserId}
              setCurrentUserId={setCurrentUserId}
              fetchData={fetchData}
              setFetchData={setFetchData}
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
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              currentUserId={currentUserId}
              setCurrentUserId={setCurrentUserId}
              fetchData={fetchData}
              setFetchData={setFetchData}
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
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              currentUserId={currentUserId}
              setCurrentUserId={setCurrentUserId}
              fetchData={fetchData}
              setFetchData={setFetchData}
            />
          </TabPanel>
        </TabContext>
      </Stack>
    </Paper>
  );
}
