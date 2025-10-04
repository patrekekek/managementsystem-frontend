import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function LeaveDetails() {
  const { id } = useLocalSearchParams(); // leaveId passed via navigation
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetchLeave();
  }, []);

  const handleDecision = async (decision) => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const { token } = JSON.parse(userData);

      const endpoint =
        decision === "Approved"
          ? `${API_URL}/leaves/${id}/approve`
          : `${API_URL}/leaves/${id}/reject`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update leave");
      setLeave({ ...leave, status: decision });
      Alert.alert("Success", `Leave has been ${decision.toLowerCase()}.`);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="blue" />;

  if (!leave) return <Text style={{ textAlign: "center", marginTop: 20 }}>Leave not found.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Leave Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Teacher:</Text>
        <Text style={styles.value}>
          {leave.name.first} {leave.name.last}
        </Text>

        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{leave.leaveType}</Text>

        <Text style={styles.label}>Duration:</Text>
        <Text style={styles.value}>
          {new Date(leave.startDate).toDateString()} → {new Date(leave.endDate).toDateString()}
        </Text>

        <Text style={styles.label}>Reason:</Text>
        <Text style={styles.value}>{leave.reason || "—"}</Text>

        <Text style={styles.label}>Current Status:</Text>
        <Text
          style={[
            styles.value,
            leave.status === "Approved"
              ? styles.approved
              : leave.status === "Rejected"
              ? styles.rejected
              : styles.pending,
          ]}
        >
          {leave.status}
        </Text>
      </View>

      {leave.status === "Pending" && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.approveBtn]}
            onPress={() => handleDecision("Approved")}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.rejectBtn]}
            onPress={() => handleDecision("Rejected")}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 20, color: "#333" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 16, fontWeight: "600", marginTop: 10, color: "#444" },
  value: { fontSize: 16, color: "#333", marginBottom: 6 },
  approved: { color: "green", fontWeight: "bold" },
  pending: { color: "orange", fontWeight: "bold" },
  rejected: { color: "red", fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "space-around", marginTop: 20 },
  button: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  approveBtn: { backgroundColor: "green" },
  rejectBtn: { backgroundColor: "red" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
