import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [user, setUser] = useState({});
  const [requests, setRequests] = useState([]);
  const [userForProfile, setUserForProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editInfo, setEditInfo] = useState("");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app-theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get("/api/verify-auth", {
          withCredentials: true,
        });

        if (response.data && response.data.authenticated) {
          setAuth(response.data.data);
          setUser(response.data.data);
        } else {
          setAuth({});
          setUser({});
        }
      } catch (error) {
        console.log("Auth verification failed:", error);
        setAuth({});
        setUser({});
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();

    const authInterval = setInterval(verifyAuth, 30 * 60 * 1000); // Check every 30 minutes

    return () => clearInterval(authInterval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        user,
        setUser,
        requests,
        setRequests,
        userForProfile,
        setUserForProfile,
        theme,
        setTheme,
        loading,
        editInfo,
        setEditInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
