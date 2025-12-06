// ManageTeachers.web.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import AdminWebTabs from "../../components/AdminWebTabs";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFetchTeachers } from "../../hooks/useFetchTeachers";
import { API_URL } from "../../config";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const MAX_SHELL_WIDTH = 1200;
const HORIZONTAL_PADDING = 20;

export default function ManageTeachersWeb() {
  const { user } = useAuthContext();
  const { teachers } = useFetchTeachers();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);



  const handleView = (id) => {
    router.push({
      pathname: `/(adminTabs)/teacherDetails/${id}`,
      params: { id },
    });
  };

  const sortedTeachers = [...teachers].sort((a, b) => {
    const nameA = a?.name?.last?.toLowerCase() || a?.username?.toLowerCase() || "";
    const nameB = b?.name?.last?.toLowerCase() || b?.username?.toLowerCase() || "";
    return nameA.localeCompare(nameB);
  });

  const filtered = sortedTeachers.filter((t) => {
    const full = `${t.name?.first || ""} ${t.name?.last || ""} ${t.username || ""}`.toLowerCase();
    return full.includes(query.toLowerCase());
  });

  return (
    <View style={styles.page}>
      <View style={[styles.shell, { maxWidth: MAX_SHELL_WIDTH, paddingHorizontal: HORIZONTAL_PADDING }]}>
        <AdminWebTabs />

        <View style={styles.card}>
          <div style={{ marginBottom: 12 }}>
            <Text style={styles.title}>Teachers List</Text>
            <div style={{ marginTop: 8 }} />
            <input
              placeholder="Search by name or username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={webStyles.input}
            />
          </div>

          {loading ? (
            <ActivityIndicator size="large" color="#1e3a8a" />
          ) : error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <>
              {filtered.length === 0 && (
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>No teachers found.</Text>
                </View>
              )}

              {filtered.map((item) => (
                <View key={item._id} style={styles.teacherRow}>
                  <View style={styles.rowLeft}>
                    {item.profilePicture ? (
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <Image
                        source={{ uri: item.profilePicture }}
                        style={styles.profileImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons name="person-circle-outline" size={48} color="#007AFF" />
                    )}

                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.teacherName}>
                        {item.name
                          ? `${item.name.last}, ${item.name.first}${item.name.middle ? " " + item.name.middle[0] + "." : ""}`
                          : item.username}
                      </Text>
                      <Text style={styles.teacherMeta}>
                        {item.username} — {item.office_department || "-"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rowRight}>
                    <Pressable
                      onPress={() => router.push(`/admin/edit-teacher/${item._id}`)}
                      style={({ hovered }) => [styles.editBtn, hovered && styles.editHover]}
                    >
                      <Text style={styles.editText}>Edit</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleView(item._id)}
                      style={({ hovered }) => [
                        styles.viewBtn,
                        hovered && styles.viewHover,
                        actionLoading && { opacity: 0.7 },
                      ]}
                    >
                      <Text style={styles.viewText}>View</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </>
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

  teacherRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f1f3f6", alignItems: "center" },
  rowLeft: { flexDirection: "row", alignItems: "center", maxWidth: "70%" },
  rowRight: { flexDirection: "row", alignItems: "center" },

  teacherName: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
  teacherMeta: { color: "#6b7280", marginTop: 6 },

  profileImage: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#e0e0e0" },

  editBtn: {
    backgroundColor: "#eef2ff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  editHover: { backgroundColor: "#e6eeff" },
  editText: { color: "#1e3a8a", fontWeight: "700" },

  viewBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  viewHover: { backgroundColor: "#0066e6" },
  viewText: { color: "#fff", fontWeight: "700" },

  errorBox: { paddingVertical: 16, alignItems: "center" },
  errorText: { color: "red" },

  empty: { paddingVertical: 24, alignItems: "center" },
  emptyText: { color: "#6b7280" },
});

const webStyles = {
  input: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", marginBottom: 12, fontSize: 15 },
};
