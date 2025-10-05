// hooks/useFetchLeave.js
import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useFetchLeave = (id) => {
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeave = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await AsyncStorage.getItem("user");
      if (!userData) throw new Error("No user logged in");

      const { token } = JSON.parse(userData);

      const res = await fetch(`${API_URL}/leaves/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch leave");

      const data = await res.json();
      setLeave(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchLeave();
  }, [id, fetchLeave]);

  return { leave, loading, error, refetch: fetchLeave };
};
