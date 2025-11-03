//not in use

import { useState, useEffect } from "react";
import { API_URL } from "../config"
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useFetchAllLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchAllLeaves = async () => {
            try {
                setLoading(true);

                const userData = await AsyncStorage.getItem("user");

                if (!userData) {
                    throw new Error("No user logged in")
                }

                const { token } = JSON.parse(userData);
                
                const res = await fetch(`${API_URL}/leaves/all`, {
                    method: "GET",
                    headers:{
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                })

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to fetch all leaves")
                }

                const data = await res.json();
                setLeaves(data);



            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchAllLeaves();
    }, [])
    return {leaves, loading, error}
}