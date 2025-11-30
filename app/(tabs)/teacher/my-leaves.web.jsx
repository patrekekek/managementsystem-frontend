import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import TeacherWebTabs from "../../../components/TeacherWebTabs";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useRouter } from "expo-router";
import { API_URL } from "../../../config";

const MAX_SHELL_WIDTH = 1200;
const HORIZONTAL_PADDING = 20;
const PAGE_SIZE = 10;

export default function MyLeavesWeb() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();

  const [leaves, setLeaves] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);


  const fetchPage = useCallback(
    async (pageToLoad = 1) => {
      if (!user) return;
      if (pageToLoad === 1) setIsLoadingInitial(true);
      else setIsLoadingMore(true);

      setError(null);
      try {
        const res = await fetch(
          `${API_URL}/leaves/my?page=${pageToLoad}&limit=${PAGE_SIZE}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to fetch leaves");
        }

        const data = await res.json();
        const items = Array.isArray(data) ? data : data.items || [];

        if (pageToLoad === 1) {
          setLeaves(items);
        } else {
          setLeaves((prev) => [...prev, ...items]);
        }

        setHasMore(items.length === PAGE_SIZE);
      } catch (err) {
        console.error("fetch leaves error", err);
        setError(err.message || "Failed to load leaves");
      } finally {
        setIsLoadingInitial(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [user]
  );

  // initial load
  useEffect(() => {
    if (!authLoading && user) {
      setPage(1);
      fetchPage(1);
    }
  }, [user, authLoading, fetchPage]);

  // load more handler
  const handleLoadMore = () => {
    if (isLoadingMore || isLoadingInitial || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchPage(next);
  };

  // pull-to-refresh
  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setPage(1);
    fetchPage(1);
  };

  const renderItem = ({ item }) => {
    const date = new Date(item.startDate).toLocaleDateString();
    const status = item.status || "pending";

    return (
      <Pressable
        onPress={() => router.push(`/leave-details/${item._id}`)}
        style={({ hovered }) => [styles.row, hovered && styles.rowHover]}
      >
        <View style={styles.rowLeft}>
          <Text style={styles.rowType}>{item.leaveType}</Text>
          <Text style={styles.rowDate}>{date}</Text>
        </View>

        <View style={styles.rowRight}>
          <Text
            style={[
              styles.statusBadge,
              status === "approved" && styles.approved,
              status === "rejected" && styles.rejected,
              status === "pending" && styles.pending,
            ]}
          >
            {status}
          </Text>
        </View>
      </Pressable>
    );
  };

  // List footer component
  const ListFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#16a34a" />
          <Text style={{ marginLeft: 10, color: "#6b7280" }}>Loading more…</Text>
        </View>
      );
    }
    if (!hasMore) {
      return (
        <View style={styles.footer}>
          <Text style={{ color: "#6b7280" }}>You’ve reached the end.</Text>
        </View>
      );
    }
    return null;
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <View style={styles.page}>
        <View style={[styles.shell, { maxWidth: MAX_SHELL_WIDTH, paddingHorizontal: HORIZONTAL_PADDING }]}>
          <TeacherWebTabs />
          <View style={styles.card}>
            <ActivityIndicator size="large" color="#16a34a" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={[styles.shell, { maxWidth: MAX_SHELL_WIDTH, paddingHorizontal: HORIZONTAL_PADDING }]}>
        <TeacherWebTabs />

        <View style={styles.card}>
          <Text style={styles.title}>My Leaves</Text>

          {error ? (
            <View style={styles.center}>
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : (
            <FlatList
              data={leaves}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.6}
              ListFooterComponent={ListFooter}
              refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
              }

              style={{ width: "100%" }}
            />
          )}
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
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(10,20,30,0.06)",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },

  empty: {
    fontSize: 16,
    color: "#6b7280",
    paddingVertical: 28,
    textAlign: "center",
  },

  error: {
    fontSize: 16,
    color: "#b91c1c",
  },

  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  rowHover: {
    backgroundColor: "#fbfdfb",
  },
  rowLeft: {
    flexDirection: "column",
  },
  rowType: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  rowDate: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  rowRight: {
    minWidth: 110,
    alignItems: "flex-end",
  },

  statusBadge: {
    textTransform: "capitalize",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    backgroundColor: "#F3F4F6",
  },
  approved: { backgroundColor: "#ECFDF5", color: "#065f46" },
  rejected: { backgroundColor: "#FEF2F2", color: "#991B1B" },
  pending: { backgroundColor: "#FFFBEB", color: "#92400E" },

  sep: {
    height: 1,
    backgroundColor: "#f1f3f6",
    marginVertical: 6,
  },

  footer: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
  },
});
