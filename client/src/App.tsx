import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./Pages/Auth";
import Profile from "./Pages/Profile";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
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
    </BrowserRouter>
  );
};

export default App;
