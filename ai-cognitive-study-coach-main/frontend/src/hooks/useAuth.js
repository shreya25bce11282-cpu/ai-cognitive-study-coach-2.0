import { useState } from "react";
import * as api from "../services/api";

// Tracks whether we currently have a token. Deliberately simple — no
// context provider, since only MainLayout needs to know "logged in or not".
// The token's validity is actually enforced by the backend (401 -> logout,
// handled in the axios interceptor in services/api.js).
export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(api.getToken()));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const doLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token } = await api.login(email, password);
      api.saveToken(token);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token } = await api.register(email, password);
      api.saveToken(token);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, error, loading, doLogin, doRegister, logout };
}
