import React, { createContext, useContext, useState } from "react";
import { View } from "@/types";

type StoreContextType = {
  chatView: View;
  setChatView: React.Dispatch<React.SetStateAction<View>>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [chatView, setChatView] = useState<View>("person");

  return (
    <StoreContext.Provider
      value={{
        chatView,
        setChatView,
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
