import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Redirect } from "expo-router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          setUser({ token });
        } else {
          await SecureStore.deleteItemAsync("token");
        }
        setLoading(false);
      } catch (error) {
        alert(error);
        console.error("Error loading user data:", error);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch("http://192.168.56.1:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        await SecureStore.setItemAsync("token", data.token);
        setUser({ token: data.token, user: data.userId });
        console.log(data.token);
        console.log("Login successful");
      } else {
        setUser(null);
        setError(data.message || "Invalid login credentials");
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      setUser(null);
      setError("Server error");
      console.log("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setUser(null);
      await SecureStore.deleteItemAsync("token");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
