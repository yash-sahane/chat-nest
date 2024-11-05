import { useStore } from "@/context/StoreContext";
import getCookie from "@/types/getCookie";
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  element: JSX.Element;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useStore();

  return isAuthenticated ? element : <Navigate to="/auth" />;
};

export default ProtectedRoute;
