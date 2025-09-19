"use client";
import BackdropLoader from "@/GlobalComponents/BackdropLoader";
import type React from "react";
import { createContext, useContext, useState } from "react";

interface AppContextProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

const defaultContext: AppContextProps = {
  loading: false,
  setLoading: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
};

const AppContext = createContext<AppContextProps>(defaultContext);
const useAppContext = () => useContext(AppContext);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <AppContext.Provider
      value={{ loading, setLoading, mobileOpen, setMobileOpen }}
    >
      {children}
      <BackdropLoader />
    </AppContext.Provider>
  );
};

export { AppProvider, useAppContext };
