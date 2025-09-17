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

// ✅ MUI Imports
import {
  AppBar,
  Toolbar,
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
// ✅ MUI Icons
import {
  Home as HomeIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Diversity3Rounded,
  PeopleAltRounded,
} from "@mui/icons-material";

const drawerWidth = 240;

export const sidebarItemsByRole = {
  admin: [
    { name: "Dashboard", path: "/management/dashboard", icon: HomeIcon },
    { name: "students", path: "/management/students", icon: PeopleAltRounded },
    { name: "Users", path: "/management/users", icon: PeopleAltRounded },
  ],
  teacher: [
    { name: "Dashboard", path: "/management/dashboard", icon: HomeIcon },
    { name: "Students", path: "/management/students", icon: Diversity3Rounded },
  ],
} as const;

type Role = keyof typeof sidebarItemsByRole;

export default function Sidebar({ role }: { role: Role }) {
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const items = sidebarItemsByRole[role];

  const handleLogout = () => {
    secureLocalStorage.clear();
    dispatch({ type: "RESET_APP" });
    document.cookie = "access_token=; Max-Age=0; path=/;";
    document.cookie = "refresh_token=; Max-Age=0; path=/;";
    document.cookie = "role=; Max-Age=0; path=/;";
    router.push("/login");
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
      <Stack direction="row" gap={2} alignItems="center">
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
      {/* Top AppBar for mobile */}
      {isMobile && (
        <AppBar
          position="sticky"
          color="default"
          sx={{ zIndex: theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              App Name
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer */}
      {/* Mobile Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
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
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
