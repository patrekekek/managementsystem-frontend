//not in use

import { useLeaveContext } from "./useLeaveContext";

export const useApproveLeave = () => {
    const { dispatch } = useLeaveContext();

    const approveLeave = (id) => {
        dispatch({ type: "APPROVE_LEAVE", payload:id })
    }

    return { approveLeave }
}