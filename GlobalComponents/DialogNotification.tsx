import {
  initialDialogNotificationContent,
  useAppContext,
} from "@/app/context/AppContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function DialogNotification() {
  const {
    openDialogNotification,
    setOpenDialogNotification,
    dialogNotificationContent,
    setDialogNotificationContent,
  } = useAppContext();
  const handleCloseSuccessDialog = () => {
    setOpenDialogNotification(false);
    setDialogNotificationContent(initialDialogNotificationContent);
  };
  return (
    <Dialog open={openDialogNotification}>
      <DialogTitle variant="h6" fontWeight="bold">
        {dialogNotificationContent.title}
      </DialogTitle>
      <IconButton
        onClick={handleCloseSuccessDialog}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseRoundedIcon />
      </IconButton>
      <DialogContent dividers>
        <Stack direction="row" columnGap={1}>
          {dialogNotificationContent.isSuccess ? (
            <CheckCircleIcon color="success" />
          ) : (
            <ErrorIcon color="error" />
          )}
          {dialogNotificationContent.isSuccess ? (
            <DialogContentText color="success">
              {dialogNotificationContent.content}
            </DialogContentText>
          ) : (
            <DialogContentText color="error">
              {dialogNotificationContent.content}
            </DialogContentText>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleCloseSuccessDialog}
          autoFocus
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
