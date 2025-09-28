import { useLeaveContext } from './useLeaveContext';

export const useFileLeave = () => {
    const { dispatch } = useLeaveContext();

    const fileLeave = (leaveData) => {
        dispatch({ type: 'FILE_LEAVE', payload: leaveData });
    }

    return { fileLeave }
}