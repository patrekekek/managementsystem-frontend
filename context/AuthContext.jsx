import { createContext, useReducer, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state;
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  });
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        dispatch({ type: 'LOGIN', payload: JSON.parse(user) });
      }
    } catch (err) {
      console.error("Failed to load user:", err);
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, []);


  console.log('Authcontext state: ', state)

  return (
    <AuthContext.Provider value={{...state, dispatch, loading}}>
      { children }
    </AuthContext.Provider>
  )

}