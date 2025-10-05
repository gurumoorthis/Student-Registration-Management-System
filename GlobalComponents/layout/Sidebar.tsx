"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";
import { getToastOptions } from "@/utils/getToastOptions";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import {
  IconButton,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  Stack,
  ListItemButton,
  useTheme,
} from "@mui/material";
import {
  Home as HomeIcon,
  Logout as LogoutIcon,
  Diversity3Rounded,
  PeopleAltRounded,
} from "@mui/icons-material";
import { useAppContext } from "@/app/context/AppContext";
import { supabase } from "@/supabaseClient";
import { clearAllCookies } from "@/utils/clearAllCookies";

const drawerWidth = 240;

export const sidebarItemsByRole = {
  SUPER_ADMIN: [
    { name: "Dashboard", path: "/management/dashboard", icon: HomeIcon },
    { name: "Students", path: "/management/students", icon: Diversity3Rounded },
    { name: "Users", path: "/management/users", icon: PeopleAltRounded },
  ],
  ADMIN: [
    { name: "Dashboard", path: "/management/dashboard", icon: HomeIcon },
    { name: "Students", path: "/management/students", icon: Diversity3Rounded },
  ],
} as const;

type Role = keyof typeof sidebarItemsByRole;

export default function Sidebar({ role }: { role: Role }) {
  console.log(role);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const { mobileOpen, setMobileOpen, setLoading } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const items = sidebarItemsByRole[role];

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    secureLocalStorage.clear();
    dispatch({ type: "RESET_APP" });
    clearAllCookies();
    router.push("/management/login");
    toast.success("Logged out", getToastOptions());
  };

  const SidebarContent = (
    <Stack
      sx={{
        width: drawerWidth,
        bgcolor: "background.paper",
        height: "100%",
        p: 2,
      }}
      rowGap={2}
    >
      {isMobile && (
        <IconButton
          sx={{
            position: "absolute",
            right: 2,
            top: 2,
          }}
          size="small"
          onClick={() => setMobileOpen(false)}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      )}
      <Stack direction="row" gap={1} alignItems="center">
        <SchoolRoundedIcon sx={{ fontSize: 40 }} color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Admitly
        </Typography>
      </Stack>
      <List>
        <Stack rowGap={1}>
          <>
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <ListItemButton
                  key={item.path}
                  component={Link}
                  href={item.path}
                  selected={isActive}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{ borderRadius: 2, columnGap: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <Icon color={isActive ? "primary" : "action"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    slotProps={{
                      primary: {
                        color: isActive ? "primary" : "text.secondary",
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
            <ListItemButton
              onClick={() => setOpenLogoutDialog(true)}
              sx={{ borderRadius: 2, columnGap: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 0 }}>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                slotProps={{
                  primary: {
                    color: "error",
                  },
                }}
              />
            </ListItemButton>
          </>
        </Stack>
      </List>
    </Stack>
  );

  return (
    <>
      {/* Sidebar Drawer */}
      {/* Mobile Drawer */}
      <Drawer
        open={mobileOpen}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        {SidebarContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            overflow: "hidden",
            border: "none",
          },
          width: drawerWidth,
        }}
        open
      >
        {SidebarContent}
      </Drawer>

      {/* Logout Dialog */}
      <Dialog open={openLogoutDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenLogoutDialog(false)}
            size="large"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            color="error"
            size="large"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
