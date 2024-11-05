import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./Pages/Auth";
import Profile from "./Pages/Profile";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Home";
import ProtectedRoute from "./utils/ProtectedRoute";
import { StoreContextProvider } from "./context/StoreContext";

const App = () => {
  return (
    <BrowserRouter>
      <StoreContextProvider>
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
      </StoreContextProvider>
    </BrowserRouter>
  );
};

export default App;
