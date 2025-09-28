import { LeaveContext } from "../context/LeaveContext";
import { useContext } from 'react';

export const useLeaveContext = () => {
    const context = useContext(LeaveContext);

    if (!context) {
        throw Error('useLeaveContext must be used inside LeaveContextProvider')
    }

    return context;

}