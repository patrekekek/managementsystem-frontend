import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import AdminWebTabs from "../../components/AdminWebTabs";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRouter } from "expo-router";
import { API_URL } from "../../config";

const MAX_SHELL_WIDTH = 1200;
const HORIZONTAL_PADDING = 20;

export default function LeavesWeb() {
  const { user, loading: authLoading } = useAuthContext();
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
      setError(null);
      try {
        const res = await fetch(`${API_URL}/leaves/all`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.items || [];
        setLeaves(items);
      } catch (err) {
        console.error(err);
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
      .filter((l) => (filter ? l.status === filter : true))
      .filter((l) => {
        if (!q) return true;
        const name = `${l.name?.first || ""} ${l.name?.last || ""}`.toLowerCase();
        const username = (l.username || "").toLowerCase();
        return name.includes(q) || username.includes(q);
      });
  }, [leaves, filter, query]);

  if (authLoading) {
    return (
      <View style={styles.page}>
        <View style={[styles.shell, { maxWidth: MAX_SHELL_WIDTH, paddingHorizontal: HORIZONTAL_PADDING }]}>
          <AdminWebTabs />
          <View style={styles.card}>
            <ActivityIndicator size="large" color="#1e3a8a" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={[styles.shell, { maxWidth: MAX_SHELL_WIDTH, paddingHorizontal: HORIZONTAL_PADDING }]}>
        <AdminWebTabs />

        <View style={styles.card}>
          <Text style={styles.title}>Leave Requests</Text>

          <View style={styles.controls}>
            <View style={styles.chips}>
              {["pending", "approved", "rejected"].map((s) => {
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
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable onPress={() => setFilter("")} style={({ hovered }) => [styles.chip, hovered && styles.chipHover]}>
                <Text style={styles.chipText}>All</Text>
              </Pressable>
            </View>

            {/* web search input */}
            <div style={{ minWidth: 240 }}>
              <input
                placeholder="Search name or username..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={webStyles.input}
              />
            </div>
          </View>

          {loading ? (
            <View style={styles.center}><ActivityIndicator size="small" color="#1e3a8a" /></View>
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : filteredLeaves.length === 0 ? (
            <Text style={styles.empty}>No {filter || "any"} leaves found.</Text>
          ) : (
            <View style={styles.list}>
              {filteredLeaves.map((item) => (
                <Pressable
                  key={item._id}
                  onPress={() => router.push(`/(adminTabs)/leaveDetails/${item._id}`)}
                  style={({ hovered }) => [styles.item, hovered && styles.itemHover]}
                >
                  <View>
                    <Text style={styles.name}>{item.name.last}, {item.name.first}</Text>
                    <Text style={styles.meta}>{item.leaveType} • {new Date(item.startDate).toLocaleDateString()} → {new Date(item.endDate).toLocaleDateString()}</Text>
                  </View>

                  <Text style={[
                    styles.status,
                    item.status === "approved" ? styles.approved : item.status === "rejected" ? styles.rejected : styles.pending
                  ]}>
                    {item.status}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#eef2ff", paddingVertical: 24, alignItems: "center" },
  shell: { width: "100%" },

  card: { width: "100%", backgroundColor: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 6px 20px rgba(10,20,30,0.06)" },

  title: { fontSize: 18, fontWeight: "700", color: "#1e3a8a", marginBottom: 12 },

  controls: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  chips: { flexDirection: "row", alignItems: "center", gap: 8 },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  chipHover: { backgroundColor: "#f8fafc" },
  chipActive: { backgroundColor: "#eef2ff", borderColor: "#c7d2fe" },
  chipText: { color: "#1e293b", fontWeight: "600" },
  chipTextActive: { color: "#1e3a8a" },

  list: { marginTop: 6 },

  item: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f1f3f6",
    marginBottom: 8,
  },
  itemHover: { backgroundColor: "#fbfdff" },

  name: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
  meta: { color: "#6b7280", marginTop: 4 },

  status: {
    textTransform: "capitalize",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "700",
  },
  approved: { backgroundColor: "#dcfce7", color: "#065f46" },
  rejected: { backgroundColor: "#fee2e2", color: "#991b1b" },
  pending: { backgroundColor: "#FFFBEB", color: "#92400E" },

  center: { alignItems: "center", justifyContent: "center", paddingVertical: 24 },

  empty: { color: "#6b7280", paddingVertical: 18, textAlign: "center" },
  error: { color: "#b91c1c", paddingVertical: 18 },
});

// small web-only css
const webStyles = {
  input: { padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, width: 320 },
};
