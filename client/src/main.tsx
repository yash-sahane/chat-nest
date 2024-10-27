import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import { StoreContextProvider } from "./context/StoreContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreContextProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StoreContextProvider>
  </StrictMode>
);
