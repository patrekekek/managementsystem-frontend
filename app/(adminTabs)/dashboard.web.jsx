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
import { useRouter } from "expo-router";

// hooks
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFetchAllLeaves } from "../../hooks/useFetchAllLeaves";
import { useResponsive } from "../../hooks/useResponsive";

// components
import AdminWebTabs from "../../components/AdminWebTabs";
import WebPage from "../../components/WebPage";

export default function AdminDashboardWeb() {
  const { user, loading } = useAuthContext();
  const { leaves, error } = useFetchAllLeaves();
  const { isMobile } = useResponsive();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)/login");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#dc2626" }}>Error: {error}</Text>
      </View>
    );
  }

  const totals = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === "pending").length,
    approved: leaves.filter(l => l.status === "approved").length,
    rejected: leaves.filter(l => l.status === "rejected").length,
  };

  return (
    <WebPage>
      <AdminWebTabs />

      

      {/* Stats */}
      <View style={[styles.grid, isMobile && styles.gridMobile]}>
        <StatCard label="Total Requests" value={totals.total} />
        <StatCard label="Pending" value={totals.pending} color="#D97706" />
        <StatCard label="Approved" value={totals.approved} color="#16A34A" />
        <StatCard label="Rejected" value={totals.rejected} color="#DC2626" />
      </View>

      {/* Panel */}
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
          <Text style={styles.muted}>No leave requests found.</Text>
        ) : (
          <FlatList
            data={leaves.slice(0, 8)}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            renderItem={({ item }) => <RequestRow item={item} isMobile={isMobile} />}
          />
        )}
      </View>
    </WebPage>
  );
}

/* ---------------- HELPERS ---------------- */

function StatCard({ label, value, color }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, color && { color }]}>{value}</Text>
    </View>
  );
}

function RequestRow({ item, isMobile }) {
  return (
    <View
      style={[
        styles.requestRow,
        isMobile && styles.requestRowMobile,
      ]}
    >
      <View>
        <Text style={styles.requestName}>
          {item.name.first} {item.name.last}
        </Text>
        <Text style={styles.requestType}>{item.leaveType}</Text>
      </View>

      <Text
        style={[
          styles.statusBadge,
          item.status === "approved" && styles.approved,
          item.status === "rejected" && styles.rejected,
          item.status === "pending" && styles.pending,
        ]}
      >
        {item.status}
      </Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  gridMobile: {
    flexDirection: "column",
  },

  statCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    marginRight: 12,
    flex: 1,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 4,
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

  panel: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 36,
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  muted: {
    color: "#6b7280",
  },

  linkButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  linkButtonHover: {
    backgroundColor: "#E0E7FF",
  },
  linkButtonText: {
    fontWeight: "600",
    color: "#1e3a8a",
  },

  requestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f6",
  },
  requestRowMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
  },

  requestName: {
    fontSize: 15,
    fontWeight: "600",
  },
  requestType: {
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
    backgroundColor: "#F3F4F6",
  },
  approved: { backgroundColor: "#ECFDF5", color: "#065f46" },
  rejected: { backgroundColor: "#FEF2F2", color: "#991B1B" },
  pending: { backgroundColor: "#FFFBEB", color: "#92400E" },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
