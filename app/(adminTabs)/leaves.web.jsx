import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

import AdminWebTabs from "../../components/AdminWebTabs";
import WebPage from "../../components/WebPage";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useResponsive } from "../../hooks/useResponsive";
import { API_URL } from "../../config";

export default function LeavesWeb() {
  const { user, loading: authLoading } = useAuthContext();
  const { isMobile } = useResponsive();
  const router = useRouter();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("pending");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchLeaves = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/leaves/all`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setLeaves(Array.isArray(data) ? data : data.items || []);
      } catch {
        setError("Failed to load leaves.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchLeaves();
  }, [user, authLoading]);

  const filteredLeaves = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leaves
      .filter(l => (filter ? l.status === filter : true))
      .filter(l => {
        if (!q) return true;
        const name = `${l.name?.first || ""} ${l.name?.last || ""}`.toLowerCase();
        return name.includes(q) || (l.username || "").toLowerCase().includes(q);
      });
  }, [leaves, filter, query]);

  if (authLoading) {
    return (
      <WebPage>
        <AdminWebTabs />
        <View style={styles.cardCenter}>
          <ActivityIndicator size="large" />
        </View>
      </WebPage>
    );
  }

  return (
    <WebPage>
      <AdminWebTabs />

      <View style={styles.card}>
        <Text style={styles.title}>Leave Requests</Text>

        {/* CONTROLS */}
        <View style={[styles.controls, isMobile && styles.controlsMobile]}>
          <View style={styles.chips}>
            {["pending", "approved", "rejected"].map(s => {
              const active = s === filter;
              return (
                <Pressable
                  key={s}
                  onPress={() => setFilter(s)}
                  style={({ hovered }) => [
                    styles.chip,
                    active && styles.chipActive,
                    hovered && styles.chipHover,
                  ]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => setFilter("")}
              style={({ hovered }) => [styles.chip, hovered && styles.chipHover]}
            >
              <Text style={styles.chipText}>All</Text>
            </Pressable>
          </View>

          {/* SEARCH (WEB ONLY) */}
          {Platform.OS === "web" && (
            <input
              placeholder="Search name or username…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={webStyles.input}
            />
          )}
        </View>

        {/* LIST */}
        {loading ? (
          <View style={styles.center}><ActivityIndicator /></View>
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : filteredLeaves.length === 0 ? (
          <Text style={styles.empty}>No {filter || "any"} leaves found.</Text>
        ) : (
          <View style={styles.list}>
            {filteredLeaves.map(item => (
              <Pressable
                key={item._id}
                onPress={() =>
                  router.push(`/(adminTabs)/leaveDetails/${item._id}`)
                }
                style={({ hovered }) => [
                  styles.item,
                  hovered && styles.itemHover,
                  isMobile && styles.itemMobile,
                ]}
              >
                <View style={styles.itemText}>
                  <Text style={styles.name}>
                    {item.name.last}, {item.name.first}
                  </Text>
                  <Text style={styles.meta}>
                    {item.leaveType} •{" "}
                    {new Date(item.startDate).toLocaleDateString()} →{" "}
                    {new Date(item.endDate).toLocaleDateString()}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.status,
                    item.status === "approved" && styles.approved,
                    item.status === "rejected" && styles.rejected,
                    item.status === "pending" && styles.pending,
                  ]}
                >
                  {item.status}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </WebPage>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 36,
  },
  cardCenter: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  controlsMobile: {
    flexDirection: "column",
    alignItems: "stretch",
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipHover: { backgroundColor: "#f8fafc" },
  chipActive: { backgroundColor: "#eef2ff", borderColor: "#c7d2fe" },
  chipText: { fontWeight: "600" },
  chipTextActive: { color: "#1e3a8a" },

  list: { marginTop: 6 },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f1f3f6",
    marginBottom: 8,
  },
  itemMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  itemHover: { backgroundColor: "#fbfdff" },

  itemText: { flex: 1 },

  name: { fontSize: 15, fontWeight: "700" },
  meta: { color: "#6b7280", marginTop: 4 },

  status: {
    textTransform: "capitalize",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "700",
    alignSelf: "flex-start",
  },
  approved: { backgroundColor: "#dcfce7", color: "#065f46" },
  rejected: { backgroundColor: "#fee2e2", color: "#991b1b" },
  pending: { backgroundColor: "#FFFBEB", color: "#92400E" },

  center: { alignItems: "center", paddingVertical: 24 },
  empty: { color: "#6b7280", textAlign: "center", paddingVertical: 18 },
  error: { color: "#b91c1c", paddingVertical: 18 },
});

/* web-only */
const webStyles = {
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    width: "100%",
    maxWidth: 320,
  },
};
