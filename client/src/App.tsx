import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./Pages/Auth";
import Profile from "./Pages/Profile";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Home";
import ProtectedRoute from "./utils/ProtectedRoute";
import getCookie from "./utils/getCookie";
import { useEffect } from "react";
import { AppDispatch } from "./store/store";
import { useDispatch } from "react-redux";
import { fetchUser } from "@/slices/AuthApi";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const response = await dispatch(fetchUser());
      if (fetchUser.fulfilled.match(response)) {
        if (response.payload.profileSetup) {
          navigate("/");
        }
      }
    };

    if (getCookie("jwt")) {
      getUser();
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
      <Toaster
        toastOptions={{
          style: {
            background: `hsl(var(--background))`,
            color: "hsl(var(--foreground))",
          },
        }}
      />
    </>
  );
};

export default App;
