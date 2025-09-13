import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, logoutUser } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
console.log("Saved token:", savedToken);

  if (savedToken) {
    setToken(savedToken);
    setIsAuthenticated(true);
    
    try {
      setUser(savedUser ? JSON.parse(savedUser) : null);
    } catch (error) {
      console.error("Invalid user data in localStorage:", savedUser);
      setUser(null);
      localStorage.removeItem("user"); // cleanup invalid data
    }
  }

  setLoading(false);
}, []);

  const login = async (email, password) => {
    const result = await loginUser( email, password );

    if (result.success) {
      const { data } = result.data;
   
      setToken(data.token);
      setUser(data);
      setIsAuthenticated(true);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/home");
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  const register = async (firstname, lastname, email, password) => {
    const result = await registerUser( firstname, lastname, email, password);

    if (result.success) {
      const {  data } = result.data;

      setToken(data.token);
      setUser(data);
      setIsAuthenticated(true);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/home");
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  const logout = async () => {
    await logoutUser();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
