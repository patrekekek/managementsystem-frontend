import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useReducer} from "react";
import NetInfo from "@react-native-community/netinfo";
import { API_URL } from "../config";


const LeaveContext = createContext();

const leaveReducer = (state, action) => {

  switch (action.type) {
    case "FILE_LEAVE":
      return [
        ...state,
        {
          id: Date.now().toString(),
          ...action.payload,
          status: "pending",
          synced: false,
        }
      ];
    case "APPROVE_LEAVE":
      return state.map((leave) => 
        leave.id === action.payload
          ? { ...leave, status: "approved"}
          : leave
      );
    case "REJECT_LEAVE":
      return state.map((leave) => 
        leave.id === action.payload
          ? { ...leave, status: "rejected"}
          : leave
      );
    case "UPDATE_LEAVE":
      return state.map((leave) =>
        leave.id === action.payload.id ? { ...leave, ...action.payload } : leave
      );
    case "SET_LEAVES":
      return action.payload;
    default:
      return state;
  }
}

export function LeaveProvider({ children }) {
  const [leaves, dispatch] = useReducer(leaveReducer, []);

  useEffect(() => {
    const loadLeaves = async () => {
      const stored = await AsyncStorage.getItem("leaves");
      if (stored) {
        dispatch({ type: "SET_LEAVES", payload: JSON.parse(stored) })
      }
    }
    loadLeaves();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("leaves", JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncLeaves();
      }
    });
    return () =>  unsubscribe();
  }, [leaves])

  const syncLeaves = async () => {
    for (let leave of leaves) {
      if (!leave.synced) {
        try {
          const res = await fetch(`${API_URL}/leaves`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(leave)
          })

          if (res.ok) {
            const savedLeave = await res.json();
            dispatch({
              type: "UPDATE_LEAVE",
              payload: { ...savedLeave, synced: true }
            })
          }
        } catch (error) {
          console.log("Sync failed for leave: ", leave.id, error.message);
        }
      }
    }
  }


  return (
    <LeaveContext.Provider value={{ leaves, dispatch }}>
      {children}
    </LeaveContext.Provider>
  );
}

export const useLeaves = () => useContext(LeaveContext);