// hooks/useFileLeave.js
import { useLeaveContext } from "./useLeaveContext";
import { useAuthContext } from "./useAuthContext";
import { API_URL } from "../config";

export const useFileLeave = () => {
  const { dispatch } = useLeaveContext();
  const { user } = useAuthContext();

  const fileLeave = async (leaveData) => {
    if (!user) {
      throw new Error("You must be logged in to file a leave");
    }

    try {
      const res = await fetch(`${API_URL}/leaves/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // ✅ attach token
        },
        body: JSON.stringify(leaveData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to file leave");
      }

      const data = await res.json();

      // ✅ update context state with new leave
      dispatch({ type: "FILE_LEAVE", payload: data });

      return data;
    } catch (error) {
      console.error("File Leave Error:", error.message);
      throw error;
    }
  };

  return { fileLeave };
};
