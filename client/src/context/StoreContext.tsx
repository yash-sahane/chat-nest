import { ApiResponse } from "@/types/apiResponse";
import getCookie from "@/utils/getCookie";
import User from "@/types/user";
import { ProfileThemeKeys } from "@/utils/profileThemeKeys";
import axios from "axios";
import { AxiosResponse } from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type StoreContextType = {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  activeProfileTheme: ProfileThemeKeys;
  setActiveProfileTheme: React.Dispatch<React.SetStateAction<ProfileThemeKeys>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User>();
  const [activeProfileTheme, setActiveProfileTheme] =
    useState<ProfileThemeKeys>("violet");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <StoreContext.Provider
      value={{
        user,
        setUser,
        activeProfileTheme,
        setActiveProfileTheme,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreContextProvider");
  }
  return context;
};
