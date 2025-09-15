// context/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import { mockAccounts } from "../constants/mockAccounts";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const account = mockAccounts.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (account) {
      setUser(account); // store account in contexta
      return true;
    } else {
      return false;
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
