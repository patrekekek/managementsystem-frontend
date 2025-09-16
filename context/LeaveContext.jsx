import React, { createContext, useContext, useState } from "react";

const LeaveContext = createContext();

export function LeaveProvider({ children }) {
  const [leaves, setLeaves] = useState([]); // shared leave requests

  // teacher filing a request
  const fileLeave = (leaveData) => {
    const newLeave = {
      id: Date.now().toString(),
      ...leaveData,
      status: "pending",
    };
    setLeaves((prev) => [...prev, newLeave]);
  };

  // admin approving
  const approveLeave = (id) => {
    setLeaves((prev) =>
      prev.map((leave) =>
        leave.id === id ? { ...leave, status: "approved" } : leave
      )
    );
  };

  // admin rejecting
  const rejectLeave = (id) => {
    setLeaves((prev) =>
      prev.map((leave) =>
        leave.id === id ? { ...leave, status: "rejected" } : leave
      )
    );
  };

  return (
    <LeaveContext.Provider
      value={{ leaves, fileLeave, approveLeave, rejectLeave }}
    >
      {children}
    </LeaveContext.Provider>
  );
}

export const useLeaves = () => useContext(LeaveContext);
