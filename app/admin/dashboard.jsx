// app/admin/dashboard.jsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const pendingRequests = [
    { id: "1", teacher: "Mr. Cruz", type: "Sick Leave", date: "Sept 14" },
    { id: "2", teacher: "Ms. Reyes", type: "Vacation Leave", date: "Sept 12" },
    { id: "3", teacher: "Mr. Santos", type: "Emergency Leave", date: "Sept 10" },
  ];

  const handleLogout = () => {
    logout();
    router.replace("/");
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>
          🛡️ Welcome, {user?.username || "Admin"}
        </Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      
      </View>

      <Text style={styles.subText}>
          You have {pendingRequests.length} pending requests
      </Text>

      {/* Quick Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Stats</Text>
        <Text style={styles.stat}>Pending Approvals: {pendingRequests.length}</Text>
        <Text style={styles.stat}>Approved This Month: 12</Text>
        <Text style={styles.stat}>Rejected This Month: 3</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/admin/leave-details")}
        >
          <Ionicons name="list-outline" size={24} color="#2196F3" />
          <Text style={styles.actionLabel}>View All Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/admin/manage-teachers")}
        >
          <Ionicons name="people-outline" size={24} color="#4CAF50" />
          <Text style={styles.actionLabel}>Manage Teachers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/admin/reports")}
        >
          <Ionicons name="analytics-outline" size={24} color="#FF9800" />
          <Text style={styles.actionLabel}>Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Pending Requests */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pending Requests</Text>
        <FlatList
          data={pendingRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.requestItem}>
              • {item.teacher} filed {item.type} ({item.date})
            </Text>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  stat: {
    fontSize: 16,
    color: "#444",
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  requestItem: {
    fontSize: 15,
    color: "#555",
    marginBottom: 6,
  },

  logoutButton: {
    backgroundColor: "#ADD8E6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
