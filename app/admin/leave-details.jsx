import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function LeaveDetails() {
  // Mock leave data — in real app, pass this via navigation params or fetch from backend
  const [leave, setLeave] = useState({
    id: "1",
    teacher: "Juan Dela Cruz",
    type: "Vacation Leave",
    startDate: "2025-09-20",
    endDate: "2025-09-22",
    reason: "Family outing",
    status: "Pending",
  });

  const handleDecision = (decision) => {
    setLeave({ ...leave, status: decision });
    Alert.alert("Success", `Leave has been ${decision}.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Leave Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Teacher:</Text>
        <Text style={styles.value}>{leave.teacher}</Text>

        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{leave.type}</Text>

        <Text style={styles.label}>Duration:</Text>
        <Text style={styles.value}>
          {leave.startDate} → {leave.endDate}
        </Text>

        <Text style={styles.label}>Reason:</Text>
        <Text style={styles.value}>{leave.reason}</Text>

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
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
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
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#444",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  approved: {
    color: "green",
    fontWeight: "bold",
  },
  pending: {
    color: "orange",
    fontWeight: "bold",
  },
  rejected: {
    color: "red",
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  approveBtn: {
    backgroundColor: "green",
  },
  rejectBtn: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
