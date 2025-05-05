import { createContext, useState, useEffect, ReactNode } from "react";
import api from "../services/api";
import { User } from "../types/User";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get("/users/current");
        setUser(response.data);
      } catch {
        // User is not logged in, which is fine
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/users/login", { username, password });
      setUser(response.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (err && typeof err === "object" && "response" in err) {
        // Axios error
        const axiosErr = err as { response?: { data?: string } };
        setError(axiosErr.response?.data || "Login failed");
      } else {
        setError("Login failed. Please try again.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/users/register", {
        username,
        password,
      });
      setUser(response.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (err && typeof err === "object" && "response" in err) {
        // Axios error
        const axiosErr = err as { response?: { data?: string } };
        setError(axiosErr.response?.data || "Registration failed");
      } else {
        setError("Registration failed. Please try again.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/users/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
