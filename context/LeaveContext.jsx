// context/LeaveContext.jsx
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const [leaves, setLeaves] = useState([]);
  const { user } = useAuth();

  const fileLeave = (leaveData) => {
    if (!user) return; // prevent filing without login

    const newLeave = {
      id: Date.now(), // unique id
      userId: user.id, // attach logged-in user
      ...leaveData,
    };

    setLeaves((prev) => [...prev, newLeave]);
  };

  return (
    <LeaveContext.Provider value={{ leaves, fileLeave }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeaves = () => useContext(LeaveContext);
