import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
    const { dispatch } = useAuthContext();

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            dispatch({type: 'LOGOUT'})
        } catch (error) {
            console.error("Log out failed", error)
        }

    }

    return { logout }
}