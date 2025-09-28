import { useLeaveContext } from "./useLeaveContext";

export const useSyncLeaves = () => {
  const { dispatch, leaves } = useLeaveContext();

  const syncLeaves = async (API_URL) => {
    for (let leave of leaves) {
      if (!leave.synced) {
        try {
          const res = await fetch(`${API_URL}/leaves`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(leave),
          });

          if (res.ok) {
            const savedLeave = await res.json();
            dispatch({
              type: "UPDATE_LEAVE",
              payload: { ...savedLeave, synced: true },
            });
          }
        } catch (error) {
          console.log("Sync failed for leave:", leave.id, error.message);
        }
      }
    }
  };

  return { syncLeaves };
};
