import { ApiResponse } from "@/types/apiResponse";
import getCookie from "@/types/getCookie";
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

  useEffect(() => {
    const fetchUser = async () => {
      // console.log("fetching user");

      const response: AxiosResponse<ApiResponse> = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/api/user/`,
        { withCredentials: true }
      );
      const { data } = response;
      // console.log(data);

      if (data.success) {
        setUser(data.data);
        setIsAuthenticated(true);
        if (data.data.profileSetup) {
          navigate("/");
        }
      }
    };

    if (getCookie("jwt")) {
      fetchUser();
    } else {
      localStorage.removeItem("isAuthenticated");
    }
  }, []);

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
