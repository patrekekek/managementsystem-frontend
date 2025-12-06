import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../../config"

export default function TeacherDashboard() {
  const { user, loading } = useAuthContext();
  const { logout } = useLogout();
  const router = useRouter();

  const [recentActivity, setRecentActivity] = useState([]);


  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)/login");
    }
  }, [user, loading]);

  useEffect(() => {

    //make this into hook later
  const fetchRecentLeaves = async () => {
      if (!user || loading) return;

      try {
        const res = await fetch(`${API_URL}/leaves/my/recent`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        setRecentActivity(data);
      } catch (error) {
        console.error("Failed to load recent leaves:", error);
      }
    };

      fetchRecentLeaves();
  }, [user, loading]);

  const handleLogout = async () => {
    await logout();
  }


  if (loading) {
    return <Text>Loading... </Text>
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>
          👋 Welcome, {user?.username || "Teacher"}
        </Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

        
      </View>

      

      {/* Leave Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Leave Summary</Text>
        <Text style={styles.leaveType}>Vacation: 5 days left</Text>
        <Text style={styles.leaveType}>Sick: 3 days left</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(tabs)/teacher/file-leave")}
        >
          <Ionicons name="create-outline" size={24} color="#4CAF50" />
          <Text style={styles.actionLabel}>File Leave</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(tabs)/teacher/my-leaves")}
        >
          <Ionicons name="folder-outline" size={24} color="#2196F3" />
          <Text style={styles.actionLabel}>My Leaves</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(tabs)/teacher/leave-history")}
        >
          <Ionicons name="time-outline" size={24} color="#FF9800" />
          <Text style={styles.actionLabel}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        <FlatList
          data={recentActivity}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Text style={styles.activityItem}>
              • {item.leaveType} leave filed ({new Date(item.startDate).toLocaleDateString()} → {new Date(item.endDate).toLocaleDateString()})
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
  leaveType: {
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
  },
  activityItem: {
    fontSize: 15,
    color: "#555",
    marginBottom: 6,
  },

  logoutButton: {
    backgroundColor: "#D1FFBD",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

});
