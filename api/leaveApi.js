import { API_URL } from "../config";


export const applyLeave = async ({ userId, startDate, endDate, reason }, token) => {
  const res = await fetch(`${API_URL}/leaves/apply`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }) 
    },
    body: JSON.stringify({ userId, startDate, endDate, reason }),
  });
  return res.json();
};


export const approveLeave = async (leaveId, token) => {
  const res = await fetch(`${API_URL}/leaves/approve/${leaveId}`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  return res.json();
};


export const rejectLeave = async (leaveId, token) => {
  const res = await fetch(`${API_URL}/leaves/reject/${leaveId}`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  return res.json();
};

// Get leave balance for a user
export const getLeaveBalance = async (userId, token) => {
  const res = await fetch(`${API_URL}/leaves/balance/${userId}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }) 
    },
  });
  return res.json();
};

// Get all leaves (admin)
export const getAllLeaves = async (token) => {
  const res = await fetch(`${API_URL}/leaves/all`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  return res.json();
};
