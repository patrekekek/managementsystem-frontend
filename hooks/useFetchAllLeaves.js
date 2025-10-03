import { useState, useEffect } from "react";
import { API_URL } from "../config"

export const useFetchAllLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchAllLeaves = async () => {
            try {
                const res = await fetch(`${API_URL}/leaves`)
            } catch (error) {

            }
        }
    })

}