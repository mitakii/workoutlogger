import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../api/api";

const AuthContext = createContext([]);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("auth/status")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
    console.log(user);
  }, []);

  useEffect(() => {
    api
      .get("auth/status")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
    console.log(user);
  }, [setLoading]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthState = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
