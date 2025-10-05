import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ManageTeachers() {
  // Temporary list of teachers
  const [teachers] = useState([
    { id: "1", name: "Juan Dela Cruz", department: "Mathematics" },
    { id: "2", name: "Maria Santos", department: "Science" },
    { id: "3", name: "Jose Rizal", department: "English" },
    { id: "4", name: "Ana Lopez", department: "Filipino" },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teachers List</Text>

      <FlatList
        data={teachers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.infoContainer}>
              <Ionicons name="person-circle-outline" size={40} color="#007AFF" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.department}>{item.department}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => console.log(`View details for ${item.name}`)}
            >
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  department: {
    fontSize: 14,
    color: "gray",
  },
  viewButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  viewText: {
    color: "#fff",
    fontWeight: "600",
  },
  separator: {
    height: 10,
  },
});
