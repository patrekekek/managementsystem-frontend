// components/LeaveCard.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LeaveCard({ type, date, status, requestedBy }) {
  return (
    <View style={styles.card}>
      <Text style={styles.type}>{type}</Text>
      <Text style={styles.date}>{date}</Text>

      {/* For admin view, show who requested it */}
      {requestedBy && (
        <Text style={styles.requestedBy}>👤 {requestedBy}</Text>
      )}

      <Text
        style={[
          styles.status,
          status === "Approved"
            ? styles.approved
            : status === "Rejected"
            ? styles.rejected
            : styles.pending,
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  type: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  requestedBy: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#444",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 6,
  },
  approved: {
    color: "green",
  },
  pending: {
    color: "orange",
  },
  rejected: {
    color: "red",
  },
});
