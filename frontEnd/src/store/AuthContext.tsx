import { createContext } from "react";

interface LoginCredentials {
  username: string;
  password: string;
}

interface SignUpCredentials {
  username: string;
  password: string;
  confirmPassword: string;
}

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  login: (data: LoginCredentials) => Promise<void>;
  logout: () => void;
  signUp: (data: SignUpCredentials) => Promise<void>;
  username: string | null;
}

const initialToken = localStorage.getItem("token") || null;
const username = localStorage.getItem("username") || null;

const initialAuthValue: AuthContextType = {
  token: initialToken,
  isLoggedIn: !!initialToken,
  login: async () => {},
  logout: () => {},
  signUp: async () => {},
  username: username,
};

const AuthContext = createContext(initialAuthValue);

export default AuthContext;
