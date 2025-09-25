
import React, { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../api/userApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const data = await loginUser({
        username: username.trim(),
        password
      });

      if (data) {
        setUser({
          _id: data._id,
          username: data.username,
          email: data.email,
          role: data.role,
          name: data.name,
          office_department: data.office_department,
          position: data.position,
          salary: data.salary,
          token: data.token,
        });
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  };


  const register = async ({
    name,
    username,
    office_department,
    position,
    salary,
    email,
    password,
    role = "teacher",
  }) => {
    try {
      const data = await registerUser({
        name,
        username: username.trim(),
        office_department,
        position,
        salary,
        email: email.trim(),
        password,
        role,
      });

      if (data) {
        setUser({
          _id: data._id,
          username: data.username,
          email: data.email,
          role: data.role,
          name: data.name,
          office_department: data.office_department,
          position: data.position,
          salary: data.salary,
          token: data.token,
        });
      }

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      return null;
    }
  };


  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);