import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./components/auth/AuthContextProvider.tsx";
import { UserContextProvider } from "./components/user/UserContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <UserContextProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </UserContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
