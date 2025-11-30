import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  FlatList,
} from "react-native";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../../config";

import TeacherWebTabs from "../../../components/TeacherWebTabs";

export default function TeacherDashboardWeb() {
  const { user, loading } = useAuthContext();
  const { logout } = useLogout();
  const router = useRouter();

  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchRecentLeaves = async () => {
      if (!user || loading) return;
      setIsLoadingRecent(true);
      try {
        const res = await fetch(`${API_URL}/leaves/my/recent`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setRecentActivity(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load recent leaves:", err);
        setRecentActivity([]);
      } finally {
        setIsLoadingRecent(false);
      }
    };

    fetchRecentLeaves();
  }, [user, loading]);

  const handleLogout = async () => {
    await logout();
  };

  const totals = {
    total: recentActivity.length,
    pending: recentActivity.filter((l) => l.status === "pending").length,
    approved: recentActivity.filter((l) => l.status === "approved").length,
    rejected: recentActivity.filter((l) => l.status === "rejected").length,
  };


  return (
    <View style={styles.page}>
      <View style={styles.shell}>

        <TeacherWebTabs />

        {/* Content area */}
        <View style={styles.content}>
          {/* Stats grid */}
          <View style={styles.grid}>
            <View style={[styles.statCard, styles.statPrimary]}>
              <Text style={styles.statLabel}>Total (recent)</Text>
              <Text style={styles.statValue}>{totals.total}</Text>
            </View>

            <View style={[styles.statCard]}>
              <Text style={styles.statLabel}>Pending</Text>
              <Text style={[styles.statValue, { color: "#D97706" }]}>{totals.pending}</Text>
            </View>

            <View style={[styles.statCard]}>
              <Text style={styles.statLabel}>Approved</Text>
              <Text style={[styles.statValue, { color: "#16A34A" }]}>{totals.approved}</Text>
            </View>

            <View style={[styles.statCard]}>
              <Text style={styles.statLabel}>Rejected</Text>
              <Text style={[styles.statValue, { color: "#DC2626" }]}>{totals.rejected}</Text>
            </View>
          </View>

          {/* Quick actions row */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={() => router.push("/(tabs)/teacher/file-leave")}
              style={({ hovered, pressed }) => [
                styles.primaryAction,
                hovered && styles.primaryActionHover,
                pressed && { transform: [{ scale: 0.995 }] },
              ]}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.primaryActionText}>File New Leave</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(tabs)/teacher/my-leaves")}
              style={({ hovered, pressed }) => [
                styles.secondaryAction,
                hovered && styles.secondaryActionHover,
                pressed && { transform: [{ scale: 0.995 }] },
              ]}
            >
              <Ionicons name="folder-outline" size={18} color="#064E3B" />
              <Text style={styles.secondaryActionText}>View My Leaves</Text>
            </Pressable>
          </View>

          {/* Recent activity */}
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Recent Activity</Text>
            {isLoadingRecent ? (
              <Text style={{ color: "#6b7280" }}>Loading recent activity…</Text>
            ) : recentActivity.length === 0 ? (
              <Text style={{ color: "#6b7280" }}>No recent leaves found.</Text>
            ) : (
              <FlatList
                data={recentActivity}
                keyExtractor={(it) => it._id || it.id || Math.random().toString()}
                renderItem={({ item }) => {
                  const start = new Date(item.startDate).toLocaleDateString();
                  const end = new Date(item.endDate).toLocaleDateString();
                  return (
                    <View style={styles.activityRow}>
                      <View style={styles.activityLeft}>
                        <Text style={styles.activityType}>{item.leaveType}</Text>
                        <Text style={styles.activityRange}>{start} — {end}</Text>
                      </View>
                      <View>
                        <Text style={[
                          styles.statusBadge,
                          item.status === "approved" && styles.approved,
                          item.status === "rejected" && styles.rejected,
                          item.status === "pending" && styles.pending,
                        ]}>
                          {item.status}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    paddingVertical: 24,
    alignItems: "center",
  },
  shell: {
    width: "100%",
    maxWidth: 1200,
    paddingHorizontal: 20,
  },

  topbar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  brand: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  brandSub: {
    color: "#6b7280",
    fontSize: 13,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 8,
  },
  username: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginRight: 12,
  },
  logout: {
    backgroundColor: "#EFEDF7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  logoutHover: {
    backgroundColor: "#e8e5ff",
  },
  logoutText: {
    color: "#4b5563",
    fontWeight: "600",
  },

  tabsWrap: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e9ef",
    paddingBottom: 10,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  tabHover: {
    backgroundColor: "#f3f5f7",
  },
  tabLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },

  content: {
    width: "100%",
    marginTop: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    minWidth: 240,
    marginRight: 12,
    marginBottom: 12,
    flex: 1,
    maxWidth: 260,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 4,
  },
  statPrimary: {
    backgroundColor: "#f8faf8",
  },
  statLabel: {
    color: "#6b7280",
    fontSize: 13,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  primaryAction: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  primaryActionHover: { backgroundColor: "#13823d" },
  primaryActionText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },
  secondaryAction: {
    backgroundColor: "#E8F8F2",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  secondaryActionHover: { backgroundColor: "#dff2e8" },
  secondaryActionText: {
    color: "#064E3B",
    fontWeight: "700",
    marginLeft: 8,
  },

  panel: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 36,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  activityRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f6",
  },
  activityLeft: {
    flexDirection: "column",
  },
  activityType: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  activityRange: {
    fontSize: 13,
    color: "#6b7280",
  },

  statusBadge: {
    textTransform: "capitalize",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    backgroundColor: "#F3F4F6",
  },
  approved: { backgroundColor: "#ECFDF5", color: "#065f46" },
  rejected: { backgroundColor: "#FEF2F2", color: "#991B1B" },
  pending: { backgroundColor: "#FFFBEB", color: "#92400E" },
});
