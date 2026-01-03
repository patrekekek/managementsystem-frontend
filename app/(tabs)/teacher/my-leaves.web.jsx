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
import { useResponsive } from "../../../hooks/useResponsive";
import { useRouter } from "expo-router";
import { API_URL } from "../../../config";

const PAGE_SIZE = 10;

export default function MyLeavesWeb() {
  const { user, loading: authLoading } = useAuthContext();
  const { isMobile } = useResponsive();
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

      pageToLoad === 1 ? setIsLoadingInitial(true) : setIsLoadingMore(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_URL}/leaves/my?page=${pageToLoad}&limit=${PAGE_SIZE}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        const items = Array.isArray(data) ? data : data.items || [];

        setLeaves((prev) => (pageToLoad === 1 ? items : [...prev, ...items]));
        setHasMore(items.length === PAGE_SIZE);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load leaves");
      } finally {
        setIsLoadingInitial(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (!authLoading && user) {
      setPage(1);
      fetchPage(1);
    }
  }, [user, authLoading, fetchPage]);

  const handleLoadMore = () => {
    if (isLoadingMore || isLoadingInitial || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchPage(next);
  };

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
        style={({ hovered }) => [
          styles.row,
          isMobile && styles.rowMobile,
          hovered && styles.rowHover,
        ]}
      >
        <View style={styles.rowLeft}>
          <Text style={styles.rowType}>{item.leaveType}</Text>
          <Text style={styles.rowDate}>{date}</Text>
        </View>

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
      </Pressable>
    );
  };

  const ListFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#16a34a" />
          <Text style={styles.footerText}>Loading more…</Text>
        </View>
      );
    }
    if (!hasMore) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>You’ve reached the end.</Text>
        </View>
      );
    }
    return null;
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <View style={styles.page}>
        <View style={styles.shell}>
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
      <View style={styles.shell}>
        <TeacherWebTabs />

        <View style={[styles.card, isMobile && styles.cardMobile]}>
          <Text style={styles.title}>My Leaves</Text>

          {error ? (
            <View style={styles.center}>
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : leaves.length === 0 && !isLoadingInitial ? (
            <Text style={styles.empty}>No leaves found.</Text>
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
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                />
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
    maxWidth: 1200,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  cardMobile: {
    padding: 14,
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
    fontSize: 15,
    color: "#6b7280",
    paddingVertical: 24,
    textAlign: "center",
  },

  error: {
    fontSize: 15,
    color: "#b91c1c",
  },

  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  rowMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
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

  statusBadge: {
    marginTop: 6,
    textTransform: "capitalize",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "700",
    backgroundColor: "#F3F4F6",
    color: "#374151",
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
  },
  footerText: {
    marginLeft: 10,
    color: "#6b7280",
  },
});
