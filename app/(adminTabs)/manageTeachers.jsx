import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFetchTeachers } from "../../hooks/useFetchTeachers";
import { router } from "expo-router";

export default function ManageTeachers() {
  const { teachers, loading, error } = useFetchTeachers();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading teachers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teachers List</Text>

      <FlatList
        data={teachers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.infoContainer}>
              <Ionicons name="person-circle-outline" size={40} color="#007AFF" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.name}>
                  {item.name
                    ? `${item.name.first} ${item.name.middle ? item.name.middle[0] + ". " : ""}${item.name.last}`
                    : item.username}
                </Text>
                <Text style={styles.department}>{item.office_department || "N/A"}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewButton}
              onPress={() =>
                router.push({
                  pathname: `/(adminTabs)/teacherDetails/${item._id}`,
                  params: { id: item._id },
                })
              }
            >
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
