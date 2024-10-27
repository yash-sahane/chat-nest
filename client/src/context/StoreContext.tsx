import { ProfileThemeKeys } from "@/utils/profileThemeKeys";
import React, { createContext, useContext, useState } from "react";

type User = object | undefined;
type StoreContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<object>>;
  activeProfileTheme: ProfileThemeKeys;
  setActiveProfileTheme: React.Dispatch<React.SetStateAction<ProfileThemeKeys>>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<object>();
  const [activeProfileTheme, setActiveProfileTheme] =
    useState<ProfileThemeKeys>("violet");

  return (
    <StoreContext.Provider
      value={{
        user,
        setUser,
        activeProfileTheme,
        setActiveProfileTheme,
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
