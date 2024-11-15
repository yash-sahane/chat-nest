import { RootState } from "@/store/store";
import getCookie from "@/utils/getCookie";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  element: JSX.Element;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? element : <Navigate to="/auth" />;
};

export default ProtectedRoute;
