import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function LeaveHistory() {
  // Mock data – replace with backend fetch later
  const [history, setHistory] = useState([
    {
      id: "1",
      type: "Vacation Leave",
      startDate: "2025-08-20",
      endDate: "2025-08-25",
      reason: "Family trip",
      status: "Approved",
    },
    {
      id: "2",
      type: "Sick Leave",
      startDate: "2025-09-05",
      endDate: "2025-09-07",
      reason: "Flu",
      status: "Rejected",
    },
    {
      id: "3",
      type: "Emergency Leave",
      startDate: "2025-09-10",
      endDate: "2025-09-10",
      reason: "Urgent errand",
      status: "Pending",
    },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.type}>{item.type}</Text>
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

      <Text style={styles.date}>
        {item.startDate} → {item.endDate}
      </Text>
      <Text style={styles.reason}>Reason: {item.reason}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Leave History</Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No leave history found.</Text>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  reason: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
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
