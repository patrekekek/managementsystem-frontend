import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useLeaveContext } from "../../hooks/useLeaveContext";

export default function Leaves() {
  const router = useRouter();
  const { leaves, loading, error, fetchLeaves } = useLeaveContext();
  const [filter, setFilter] = useState("pending");


  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}.</Text>;


  const filteredLeaves = leaves.filter((item) => item.status === filter);

  return (
    <View style={styles.container}>
      {/* FILTER BUTTONS */}
      <View style={styles.filterContainer}>
        {["pending", "approved", "rejected"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filter === status && styles.activeFilterButton,
            ]}
            onPress={() => setFilter(status)}
          >
            <Text
              style={[
                styles.filterText,
                filter === status && styles.activeFilterText,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LEAVES LIST */}
      {filteredLeaves.length === 0 ? (
        <Text style={styles.noLeaves}>No {filter} leaves found.</Text>
      ) : (
        <FlatList
          data={filteredLeaves}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                router.push(`/(adminTabs)/leaveDetails/${item._id}`)
              }
            >
              <Text style={styles.title}>
                {item.name.last}, {item.name.first}
              </Text>

              <Text style={styles.text}>Type: {item.leaveType}</Text>
              <Text style={styles.text}>
                Duration: {new Date(item.startDate).toLocaleDateString()} →{" "}
                {new Date(item.endDate).toLocaleDateString()}
              </Text>
              <Text
                style={[
                  styles.status,
                  item.status === "approved"
                    ? styles.approved
                    : item.status === "rejected"
                    ? styles.rejected
                    : styles.pending,
                ]}
              >
                Status: {item.status}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },


  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  filterText: { color: "#333", fontWeight: "500" },
  activeFilterText: { color: "#fff" },


  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  title: { fontWeight: "bold", marginBottom: 4 },
  text: { color: "#333" },
  status: { marginTop: 4, fontWeight: "600" },
  approved: { color: "green" },
  rejected: { color: "red" },
  pending: { color: "orange" },

  noLeaves: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
