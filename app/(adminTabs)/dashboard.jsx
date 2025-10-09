import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useAuthContext } from "../../hooks/useAuthContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLogout } from "../../hooks/useLogout"
import { useFetchAllLeaves } from "../../hooks/useFetchAllLeaves";

export default function AdminDashboard() {
  const { user, loading } = useAuthContext();
  const { logout } = useLogout();
  const { leaves, error } = useFetchAllLeaves();


  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)/login");
    }
  }, [user, loading]);

  const handleLogout = () => {
    logout();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading user...</Text>
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>No user found. Please log in again.</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );
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
          You have {leaves.length} pending requests
      </Text>

      {/* Quick Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Stats</Text>
        <Text style={styles.stat}>Pending Approvals: {leaves.length}</Text>
        <Text style={styles.stat}>Approved This Month: 12</Text>
        <Text style={styles.stat}>Rejected This Month: 3</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(adminTabs)/leaveDetails")}
        >
          <Ionicons name="list-outline" size={24} color="#2196F3" />
          <Text style={styles.actionLabel}>View All Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(adminTabs)/manageTeachers")}
        >
          <Ionicons name="people-outline" size={24} color="#4CAF50" />
          <Text style={styles.actionLabel}>Manage Teachers</Text>
        </TouchableOpacity>


      </View>

      {/* Pending Requests */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pending Requests</Text>
        <FlatList
          data={leaves}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Text style={styles.requestItem}>
              • {item.name.first} {item.name.last} filed {item.leaveType}
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
