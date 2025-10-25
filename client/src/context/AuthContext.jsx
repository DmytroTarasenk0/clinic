import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Login / Register / Logout / Auth Check
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  const login = async (username, password) => {
    const response = await axios.post("http://localhost:5000/api/user/login", {
      username,
      password,
    });
    if (response.data) {
      setUser(response.data);
    }
    return response.data;
  };

  // Register and login immediately
  const register = async (userData) => {
    const response = await axios.post(
      "http://localhost:5000/api/user/register",
      userData
    );
    if (response.data) {
      setUser(response.data);
    }
    return response.data;
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/logout");
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  // Check session status
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/auth");
        setUser(response.data);
      } catch (err) {
        setUser(null);
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
