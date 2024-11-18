import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvier.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <Provider store={store}>
        <SocketProvider>
          <App />
        </SocketProvider>
      </Provider>
    </ThemeProvider>
  </BrowserRouter>
);
