import { ReactNode, useState } from "react";
import {
  toastifyError,
  toastifySuccess,
} from "../../Helpers/notificationToastify.ts";
import AuthContext from "../../store/AuthContext";

interface AuthContextProviderProps {
  children: ReactNode;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface SignUpCredentials {
  username: string;
  password: string;
  confirmPassword: string;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const token: string | null = localStorage.getItem("token") || null;
  const usernameStored: string | null =
    localStorage.getItem("username") || null;
  const [authToken, setAuthToken] = useState<string | null>(token);
  const [username, setUsername] = useState<string | null>(usernameStored);

  async function login(data: LoginCredentials): Promise<void> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "content-type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const resData: {
        message: string;
        token: string;
        name: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(resData.message);
      }

      localStorage.setItem("token", resData.token || "");
      localStorage.setItem("username", resData.name);
      setAuthToken(resData.token || null);
      setUsername(resData.name);
      toastifySuccess(resData.message);
    } catch (error) {
      toastifyError((error as Error).message || "Internal Error");
      throw error;
    }
  }

  function logout() {
    setAuthToken(null);
    localStorage.removeItem("token");
  }

  async function signUp(data: SignUpCredentials): Promise<void> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "content-type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const resData: {
        message: string;
        token: string;
        name: string;
      } = await response.json();
      if (!response.ok) {
        throw new Error(resData.message);
      }
      localStorage.setItem("token", resData.token);
      localStorage.setItem("username", resData.name);
      setAuthToken(resData?.token || null);
      setUsername(resData?.name);
      toastifySuccess(resData.message);
    } catch (error) {
      toastifyError((error as Error).message || "Internal Error");
      throw error;
    }
  }

  const authCtxValue = {
    token: authToken,
    isLoggedIn: !!authToken,
    login,
    logout,
    signUp,
    username,
  };

  return (
    <AuthContext.Provider value={authCtxValue}>{children}</AuthContext.Provider>
  );
}
