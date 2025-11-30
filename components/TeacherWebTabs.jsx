import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";


const MAX_SHELL_WIDTH = 1200;
const HORIZONTAL_PADDING = 20;

export default function TeacherWebTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const tabs = [
    { key: "dashboard", label: "Dashboard", route: "/(tabs)/teacher/dashboard", icon: "grid-outline" },
    { key: "file", label: "File Leave", route: "/(tabs)/teacher/file-leave", icon: "create-outline" },
    { key: "my", label: "My Leaves", route: "/(tabs)/teacher/my-leaves", icon: "folder-outline" },
    { key: "profile", label: "Profile", route: "/(tabs)/teacher/profile", icon: "person-outline" },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={[styles.wrap, { maxWidth: MAX_SHELL_WIDTH, paddingHorizontal: HORIZONTAL_PADDING }]}>
      {/* Top header */}
      <View style={styles.topbar}>
        <View>
          <Text style={styles.brand}>JLNHS Management</Text>
          <Text style={styles.brandSub}>Teacher Dashboard</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.userLabel}>Logged in as</Text>
          <Text style={styles.username}>{user?.username || "Teacher"}</Text>

          <Pressable
            onPress={handleLogout}
            style={({ hovered, pressed }) => [
              styles.logout,
              hovered && styles.logoutHover,
              pressed && { transform: [{ scale: 0.99 }] },
            ]}
          >
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>
      </View>

      {/* Tabs / subnav */}
      <View style={styles.tabsWrap}>
        {tabs.map((t, i) => {
          const active = pathname?.startsWith(t.route);
          return (
            <Pressable
              key={t.key}
              onPress={() => router.push(t.route)}
              style={({ hovered }) => [
                styles.tab,
                hovered && styles.tabHover,
                active && styles.activeTab,
                i === tabs.length - 1 && { marginRight: 0 },
              ]}
            >
              <Ionicons
                name={t.icon}
                size={18}
                color={active ? "#16a34a" : "#374151"}
              />
              <Text style={[styles.tabLabel, active && styles.activeLabel]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignSelf: "center",
    marginBottom: 12,
    boxSizing: "border-box",
  },

  /* top header */
  topbar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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

  /* tabs */
  tabsWrap: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e9ef",
    paddingBottom: 10,
    flexShrink: 0,
    justifyContent: "flex-start",
  },

  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
    marginRight: 12,
    whiteSpace: "nowrap",
  },
  tabHover: {
    backgroundColor: "#f3f5f7",
  },

  activeTab: {
    backgroundColor: "#e7f7eb",
    borderBottomWidth: 2,
    borderBottomColor: "#16a34a",
  },

  tabLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  activeLabel: {
    color: "#16a34a",
  },
});
