import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../../config";

// hooks
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useResponsive } from "../../../hooks/useResponsive";

// components
import TeacherWebTabs from "../../../components/TeacherWebTabs";
import WebPage from "../../../components/WebPage";

export default function TeacherDashboardWeb() {
  const { user, loading } = useAuthContext();
  const { isMobile } = useResponsive();
  const router = useRouter();

  //temporary
  const [leaveCredits, setLeaveCredits] = useState(0);

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
      } catch {
        setRecentActivity([]);
      } finally {
        setIsLoadingRecent(false);
      }
    };
    fetchRecentLeaves();
  }, [user, loading]);

  const totals = {
    total: recentActivity.length,
    pending: recentActivity.filter(l => l.status === "pending").length,
    approved: recentActivity.filter(l => l.status === "approved").length,
    rejected: recentActivity.filter(l => l.status === "rejected").length,
  };

  return (
    <WebPage>
      <TeacherWebTabs />

      {/* Consumable Leave Credits Panel */}
      <View style={styles.creditPanel}>
        <Text style={styles.creditTitle}>Consumable Leave Credits</Text>

        {leaveCredits === null ? (
          <Text style={styles.muted}>Not available</Text>
        ) : (
          <>
            <View style={styles.creditRow}>
              <Text style={styles.creditValue}>{leaveCredits}</Text>
              <Text style={styles.creditLabel}>credits remaining</Text>
            </View>

          </>
        )}
      </View>


      <View style={[styles.grid, isMobile && styles.gridMobile]}>
        <StatCard label="Total (recent)" value={totals.total} />
        <StatCard label="Pending" value={totals.pending} color="#D97706" />
        <StatCard label="Approved" value={totals.approved} color="#16A34A" />
        <StatCard label="Rejected" value={totals.rejected} color="#DC2626" />
      </View>

      <View style={[styles.actionRow, isMobile && styles.actionRowMobile]}>
        <ActionButton
          primary
          icon="create-outline"
          label="File New Leave"
          onPress={() => router.push("/(tabs)/teacher/file-leave")}
        />
        <ActionButton
          icon="folder-outline"
          label="View My Leaves"
          onPress={() => router.push("/(tabs)/teacher/my-leaves")}
        />
      </View>


      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Recent Activity</Text>

        {isLoadingRecent ? (
          <Text style={styles.muted}>Loading…</Text>
        ) : recentActivity.length === 0 ? (
          <Text style={styles.muted}>No recent leaves.</Text>
        ) : (
          <FlatList
            data={recentActivity}
            keyExtractor={i => i._id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <ActivityRow item={item} isMobile={isMobile} />
            )}
          />
        )}
      </View>
    </WebPage>
  );
}

//helper functions

function StatCard({ label, value, color }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, color && { color }]}>{value}</Text>
    </View>
  );
}

function ActionButton({ icon, label, onPress, primary }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.actionBase,
        primary ? styles.primaryAction : styles.secondaryAction,
        hovered && (primary ? styles.primaryHover : styles.secondaryHover),
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={primary ? "#fff" : "#064E3B"}
      />
      <Text style={primary ? styles.primaryText : styles.secondaryText}>
        {label}
      </Text>
    </Pressable>
  );
}

function ActivityRow({ item, isMobile }) {
  const start = new Date(item.startDate).toLocaleDateString();
  const end = new Date(item.endDate).toLocaleDateString();

  return (
    <View
      style={[
        styles.activityRow,
        isMobile && styles.activityRowMobile,
      ]}
    >
      <View>
        <Text style={styles.activityType}>{item.leaveType}</Text>
        <Text style={styles.activityRange}>{start} — {end}</Text>
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

  /* Actions */
  actionRow: {
    flexDirection: "row",
    marginBottom: 18,
  },
  actionRowMobile: {
    flexDirection: "column",
    gap: 10,
  },
  actionBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 12,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  primaryAction: { backgroundColor: "#16a34a" },
  primaryHover: { backgroundColor: "#13823d" },
  secondaryAction: { backgroundColor: "#E8F8F2" },
  secondaryHover: { backgroundColor: "#dff2e8" },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },
  secondaryText: {
    color: "#064E3B",
    fontWeight: "700",
    marginLeft: 8,
  },

  /* Panel */
  panel: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 36,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  muted: {
    color: "#6b7280",
  },

  /* Activity */
  activityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f6",
  },
  activityRowMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
  },
  activityType: {
    fontSize: 15,
    fontWeight: "600",
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
    backgroundColor: "#F3F4F6",
  },
  approved: { backgroundColor: "#ECFDF5", color: "#065f46" },
  rejected: { backgroundColor: "#FEF2F2", color: "#991B1B" },
  pending: { backgroundColor: "#FFFBEB", color: "#92400E" },
  creditPanel: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 18,
  marginBottom: 20,
},
  creditTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  creditRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 6,
  },

  creditValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e3a8a",
  },

  creditLabel: {
    fontSize: 14,
    color: "#6b7280",
  },

  //might be used later hehehhehe
  creditNote: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
  },

});
