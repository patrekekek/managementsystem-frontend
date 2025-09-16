import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function MyLeaves() {
  // Mock data – later you can fetch from backend
  const [myLeaves, setMyLeaves] = useState([
    { id: "1", type: "Vacation Leave", date: "2025-09-01", status: "Approved" },
    { id: "2", type: "Sick Leave", date: "2025-09-05", status: "Pending" },
    { id: "3", type: "Emergency Leave", date: "2025-09-08", status: "Rejected" },
  ]);

  const renderLeave = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <Text
        style={[
          styles.status,
          item.status === "Approved"
            ? styles.approved
            : item.status === "Rejected"
            ? styles.rejected
            : styles.pending,
        ]}
      >
        {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 My Leaves</Text>

      <FlatList
        data={myLeaves}
        keyExtractor={(item) => item.id}
        renderItem={renderLeave}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No leave records found.</Text>
        }
      />
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
  empty: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 50,
  },
});
