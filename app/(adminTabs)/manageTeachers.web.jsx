import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AdminWebTabs from "../../components/AdminWebTabs";
import WebPage from "../../components/WebPage";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFetchTeachers } from "../../hooks/useFetchTeachers";
import { useResponsive } from "../../hooks/useResponsive";

export default function ManageTeachersWeb() {
  const { user } = useAuthContext();
  const { teachers } = useFetchTeachers();
  const { isMobile } = useResponsive();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [loading] = useState(false);
  const [error] = useState(null);

  const sorted = [...teachers].sort((a, b) => {
    const A = a?.name?.last || a?.username || "";
    const B = b?.name?.last || b?.username || "";
    return A.localeCompare(B);
  });

  const filtered = sorted.filter(t => {
    const full = `${t.name?.first || ""} ${t.name?.last || ""} ${t.username || ""}`.toLowerCase();
    return full.includes(query.toLowerCase());
  });

  return (
    <WebPage>
      <AdminWebTabs />

      <View style={styles.card}>
        {/* HEADER */}
        <View style={[styles.header, isMobile && styles.headerMobile]}>
          <Text style={styles.title}>Teachers List</Text>

          {Platform.OS === "web" && (
            <input
              placeholder="Search by name or username…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={webStyles.input}
            />
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filtered.length === 0 ? (
          <Text style={styles.emptyText}>No teachers found.</Text>
        ) : (
          filtered.map(item => (
            <View
              key={item._id}
              style={[
                styles.teacherRow,
                isMobile && styles.teacherRowMobile,
              ]}
            >
              {/* LEFT */}
              <View style={styles.rowLeft}>
                {item.profilePicture ? (
                  <Image
                    source={{ uri: item.profilePicture }}
                    style={styles.profileImage}
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={48}
                    color="#007AFF"
                  />
                )}

                <View style={styles.teacherInfo}>
                  <Text style={styles.teacherName}>
                    {item.name
                      ? `${item.name.last}, ${item.name.first}${
                          item.name.middle ? " " + item.name.middle[0] + "." : ""
                        }`
                      : item.username}
                  </Text>
                  <Text style={styles.teacherMeta}>
                    {item.username} — {item.office_department || "-"}
                  </Text>
                </View>
              </View>

              {/* RIGHT */}
              <View
                style={[
                  styles.rowRight,
                  isMobile && styles.rowRightMobile,
                ]}
              >
                <Pressable
                  onPress={() =>
                    router.push(`/admin/edit-teacher/${item._id}`)
                  }
                  style={({ hovered }) => [
                    styles.editBtn,
                    hovered && styles.editHover,
                  ]}
                >
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    router.push(`/(adminTabs)/teacherDetails/${item._id}`)
                  }
                  style={({ hovered }) => [
                    styles.viewBtn,
                    hovered && styles.viewHover,
                  ]}
                >
                  <Text style={styles.viewText}>View</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
    </WebPage>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 36,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  headerMobile: {
    flexDirection: "column",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  teacherRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f6",
    gap: 12,
  },
  teacherRowMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  teacherInfo: {
    flexShrink: 1,
  },

  rowRight: {
    flexDirection: "row",
    gap: 8,
  },
  rowRightMobile: {
    width: "100%",
    justifyContent: "flex-end",
  },

  teacherName: {
    fontSize: 15,
    fontWeight: "700",
  },
  teacherMeta: {
    color: "#6b7280",
    marginTop: 4,
  },

  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e0e0e0",
  },

  editBtn: {
    backgroundColor: "#eef2ff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editHover: {
    backgroundColor: "#e6eeff",
  },
  editText: {
    color: "#1e3a8a",
    fontWeight: "700",
  },

  viewBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  viewHover: {
    backgroundColor: "#0066e6",
  },
  viewText: {
    color: "#fff",
    fontWeight: "700",
  },

  emptyText: {
    color: "#6b7280",
    textAlign: "center",
    paddingVertical: 24,
  },
  errorText: {
    color: "#b91c1c",
    textAlign: "center",
    paddingVertical: 24,
  },
});

/* web-only */
const webStyles = {
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 15,
    width: "100%",
    maxWidth: 320,
  },
};
