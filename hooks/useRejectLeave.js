import { useLeaveContext } from "./useLeaveContext";

export const useRejectLeave = () => {
  const { dispatch } = useLeaveContext();

  const rejectLeave = (id) => {
    dispatch({ type: "REJECT_LEAVE", payload: id });
  };

  return { rejectLeave };
};
