import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }

        if (response.ok) {
            await AsyncStorage.setItem('user', JSON.stringify(json));
            
            dispatch({type: 'LOGIN', payload: json});
            setIsLoading(false);
        }
    }
    return { login, isLoading, error }
}