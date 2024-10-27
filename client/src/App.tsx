import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Chat from "./Pages/Chat";
import Auth from "./Pages/Auth";
import Profile from "./Pages/Profile";
import { useTheme } from "./context/ThemeProvider";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat" element={<Chat />} />
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
