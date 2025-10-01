"use client";
import BackdropLoader from "@/GlobalComponents/BackdropLoader";
import DialogNotification from "@/GlobalComponents/DialogNotification";
import { ERROR_MESSAGES } from "@/utils/constants";
import { getToastOptions } from "@/utils/getToastOptions";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

interface dialogNotificationContentProps {
  title: string;
  content: string;
  isSuccess: boolean;
}

interface AppContextProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  openDialogNotification: boolean;
  setOpenDialogNotification: (value: boolean) => void;
  dialogNotificationContent: dialogNotificationContentProps;
  setDialogNotificationContent: (value: dialogNotificationContentProps) => void;
  showCatchError: (error: Error) => void;
}
export const initialDialogNotificationContent: dialogNotificationContentProps =
  {
    title: "",
    content: "",
    isSuccess: false,
  };

const defaultContext: AppContextProps = {
  loading: false,
  setLoading: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
  openDialogNotification: false,
  setOpenDialogNotification: () => {},
  dialogNotificationContent: initialDialogNotificationContent,
  setDialogNotificationContent: () => {},
  showCatchError: () => {},
};

const AppContext = createContext<AppContextProps>(defaultContext);
const useAppContext = () => useContext(AppContext);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDialogNotification, setOpenDialogNotification] = useState(false);
  const [dialogNotificationContent, setDialogNotificationContent] = useState(
    initialDialogNotificationContent
  );
  const showCatchError = (error: Error) => {
    setLoading(false);
    toast.error(
      `Unexpected error: ${(error as Error).message}` || ERROR_MESSAGES.GENERIC,
      getToastOptions()
    );
  };
  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        mobileOpen,
        setMobileOpen,
        openDialogNotification,
        setOpenDialogNotification,
        dialogNotificationContent,
        setDialogNotificationContent,
        showCatchError,
      }}
    >
      {children}
      <BackdropLoader />
      <DialogNotification />
    </AppContext.Provider>
  );
};

export { AppProvider, useAppContext };
