//note: will be refactored in the future to small hooks.

import React, { createContext, useContext, useEffect, useReducer } from "react";
import { API_URL } from "../config";
import { useAuthContext } from "../hooks/useAuthContext";


export const LeaveContext = createContext();

const initialState = {
  leaves: [],
  loading: false,
  error: null
}

const leaveReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload, error: null };

    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "SET_LEAVES":
      return { ...state, leaves: action.payload, loading: false, error: null}

    case "UPDATE_STATUS":
      return {
        ...state,
        leaves: state.leaves.map((leave) => 
          leave._id === action.payload.id
            ? { ...leave, status: action.payload.status }
            : leave
        ),
      };
      
    default:
      return state;
  }
}

export function LeaveProvider({ children }) {
  const [state, dispatch] = useReducer(leaveReducer, initialState);
  const { user } = useAuthContext();

  const fetchLeaves = async () => {
    dispatch({ type: "SET_LOADING" });

    try {
      if (!user?.token) throw new Error("No authorization token found");

      const res = await fetch(`${API_URL}/leaves/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

      const data = await res.json();
      dispatch({ type: "SET_LEAVES", payload: data })
    } catch(error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      console.error("Error fetching leaves", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const updateLeaveStatus = async (id, status) => {
    try {
      const endpoint =
        status === "approved" 
        ? `${API_URL}/leaves/${id}/approve`
        : `${API_URL}/leaves/${id}/reject`

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
      });

      if (!res.ok) throw new Error(`Failed to update leave: ${res.statusText}`);

      const updatedLeave = await res.json();

      dispatch({
        type: "UPDATE_STATUS",
        payload: { id, status: updatedLeave.status },
      })

    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message})
      console.error("Error uploading status", error);
    }
  }

  const approveLeave = (id) => updateLeaveStatus(id, "approved");
  const rejectLeave = (id) => updateLeaveStatus(id, "rejected");

  useEffect(() => {
    if (user?.token) {
      fetchLeaves();
    }
  }, [user])

  return (
    <LeaveContext.Provider 
      value={{ 
        leaves: state.leaves,
        loading: state.loading,
        error: state.error, 
        fetchLeaves, 
        updateLeaveStatus,
        approveLeave,
        rejectLeave 

      }}>
      { children }
    </LeaveContext.Provider>
  )

}