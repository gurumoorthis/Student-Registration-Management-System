"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";
import { getToastOptions } from "@/utils/getToastOptions";
import { toTitleCase } from "@/utils/toTileCase";
import type { RootState } from "@/redux/store";

// ✅ MUI Imports
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// ✅ MUI Icons
import {
  Home as HomeIcon,
  Description as PoliciesIcon,
  People as UsersIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  AccountCircle as UserIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

export const sidebarItemsByRole = {
  admin: [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    { name: "Policies", path: "/policies", icon: PoliciesIcon },
    { name: "Users", path: "/users", icon: UsersIcon },
  ],
  agent: [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    { name: "Policies", path: "/policies", icon: PoliciesIcon },
  ],
  policy_holder: [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    { name: "Policies", path: "/policies", icon: PoliciesIcon },
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
  const { userDetails } = useSelector((state: RootState) => state.AUTH);

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
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: "background.paper",
        height: "100%",
        p: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        User Profile
      </Typography>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <UserIcon sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="subtitle1">{userDetails.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {toTitleCase(userDetails.roles?.name)}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        <Typography variant="h6" gutterBottom mt={2}>
          Menu
        </Typography>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <ListItem
              button
              key={item.path}
              component={Link}
              href={item.path}
              selected={isActive}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <ListItemIcon>
                <Icon color={isActive ? "primary" : "action"} />
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          );
        })}
        <ListItem button onClick={() => setOpenLogoutDialog(true)}>
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ color: "error" }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Top AppBar for mobile */}
      {isMobile && (
        <AppBar
          position="fixed"
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
      <nav>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
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
              boxSizing: "border-box",
            },
          }}
          open
        >
          {SidebarContent}
        </Drawer>
      </nav>

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
