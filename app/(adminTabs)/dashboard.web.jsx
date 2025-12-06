import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import { useFetchAllLeaves } from "../../hooks/useFetchAllLeaves";

import AdminWebTabs from "../../components/AdminWebTabs";

export default function AdminDashboardWeb() {
  const { user, loading } = useAuthContext();
  const { logout } = useLogout();
  const { leaves, error } = useFetchAllLeaves();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)/login");
    }
  }, [loading, user]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );

  // Admin stats
  const totals = {
    pending: leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    rejected: leaves.filter((l) => l.status === "rejected").length,
  };

  return (
    <View style={styles.page}>
      <View style={styles.shell}>

        {/* Navigation Tabs */}
        <AdminWebTabs />

        {/* Stats Section */}
        <View style={styles.grid}>
          <View style={[styles.statCard, styles.primaryStat]}>
            <Text style={styles.statLabel}>Pending Requests</Text>
            <Text style={styles.statValue}>{totals.pending}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Approved</Text>
            <Text style={[styles.statValue, { color: "#059669" }]}>
              {totals.approved}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Rejected</Text>
            <Text style={[styles.statValue, { color: "#dc2626" }]}>
              {totals.rejected}
            </Text>
          </View>
        </View>

        {/* Panel: Pending Requests */}
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Recent Leave Requests</Text>
            <Pressable
              onPress={() => router.push("/(adminTabs)/leaveDetails")}
              style={({ hovered }) => [
                styles.linkButton,
                hovered && styles.linkButtonHover,
              ]}
            >
              <Text style={styles.linkButtonText}>View All</Text>
            </Pressable>
          </View>

          {leaves.length === 0 ? (
            <Text style={{ color: "#6b7280" }}>No leave requests found.</Text>
          ) : (
            <FlatList
              data={leaves.slice(0, 8)}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.requestRow}>
                  <View>
                    <Text style={styles.requestName}>
                      {item.name.first} {item.name.last}
                    </Text>
                    <Text style={styles.requestType}>{item.leaveType}</Text>
                  </View>

                  <Text
                    style={[
                      styles.statusBadge,
                      item.status === "pending" && styles.pending,
                      item.status === "approved" && styles.approved,
                      item.status === "rejected" && styles.rejected,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
}

/* ------------------------ STYLES ------------------------ */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#eef2ff",
    paddingVertical: 24,
    alignItems: "center",
  },
  shell: {
    width: "100%",
    maxWidth: 1200,
    paddingHorizontal: 20,
  },

  /* Top header */
  topbar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  brand: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  brandSub: {
    color: "#6b7280",
    fontSize: 13,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  username: { fontSize: 15, fontWeight: "600", color: "#1e3a8a" },
  userLabel: { fontSize: 12, color: "#6b7280" },

  logout: {
    backgroundColor: "#e0e7ff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  logoutHover: { backgroundColor: "#c7d2fe" },
  logoutText: { color: "#1e3a8a", fontWeight: "600" },

  /* Stats Grid */
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
    boxShadow: "0 4px 14px rgba(10,20,30,0.08)",
  },
  primaryStat: { backgroundColor: "#eff6ff" },
  statLabel: { fontSize: 14, color: "#475569" },
  statValue: { fontSize: 30, fontWeight: "700", color: "#1e3a8a" },

  /* Panel */
  panel: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 36,
    boxShadow: "0 4px 14px rgba(10,20,30,0.06)",
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  panelTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e3a8a",
  },

  linkButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#e0e7ff",
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  linkButtonHover: { backgroundColor: "#d1d9ff" },
  linkButtonText: { color: "#1e3a8a", fontWeight: "600" },

  requestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 10,
  },
  requestName: { fontSize: 15, fontWeight: "600", color: "#1e293b" },
  requestType: { fontSize: 13, color: "#6b7280" },

  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  pending: { backgroundColor: "#fef9c3", color: "#92400e" },
  approved: { backgroundColor: "#dcfce7", color: "#065f46" },
  rejected: { backgroundColor: "#fee2e2", color: "#991b1b" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
