import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";

export default function useGetLeaves() {
    const [leaves, setLeaves] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                setLoading(true);

                const userData = await AsyncStorage.getItem("user");
                if (!userData) {
                    throw new Error("No user logged in");
                }
                const { token } = JSON.parse(userData);

                const res = await fetch(`${API_URL}/leaves/my`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                })

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to fetch leaves")
                }

                const data = await res.json();
                setLeaves(data);

            } catch (error) {
                setError(error.message)
            } finally{
                setLoading(false);
            }
        }

        fetchLeaves();
    }, [])

    return { leaves, loading, error }
}







