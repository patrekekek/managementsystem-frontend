import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { API_URL } from '../config';

export const useRegister = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();


    const register = async (userData) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            })

            const json = await res.json();

            if (!res.ok) {
                setError(json.error || "Something went wrong");
                setIsLoading(false);
                return;
            }

            dispatch({ type: 'LOGIN', payload: json})
            setIsLoading(false)

            return json;

        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    }
    return { register, isLoading, error}
}