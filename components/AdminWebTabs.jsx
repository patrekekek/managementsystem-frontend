import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

const MAX_SHELL_WIDTH = 1200;
const HORIZONTAL_PADDING = 20;

export default function AdminWebTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const tabs = [
    { key: "dashboard", label: "Dashboard", route: "/(adminTabs)/dashboard", icon: "speedometer-outline" },
    { key: "leaves", label: "Leaves", route: "/(adminTabs)/leaves", icon: "list-outline" },
    { key: "teachers", label: "Teachers", route: "/(adminTabs)/manageTeachers", icon: "people-outline" },
    { key: "profile", label: "Profile", route: "/(adminTabs)/profile", icon: "person-outline" },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={[styles.wrap, { maxWidth: MAX_SHELL_WIDTH, paddingHorizontal: HORIZONTAL_PADDING }]}>
      <View style={styles.topbar}>
        <View>
          <Text style={styles.brand}>JLNHS Management</Text>
          <Text style={styles.brandSub}>Admin Panel</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.userLabel}>Logged in as</Text>
          <Text style={styles.username}>{user?.username || "Admin"}</Text>

          <Pressable
            onPress={handleLogout}
            style={({ hovered }) => [styles.logout, hovered && styles.logoutHover]}
          >
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>
      </View>

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
              <Ionicons name={t.icon} size={18} color={active ? "#1e3a8a" : "#374151"} />
              <Text style={[styles.tabLabel, active && styles.activeLabel]}>{t.label}</Text>
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
  topbar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  brand: { fontSize: 20, fontWeight: "700", color: "#1e3a8a" },
  brandSub: { color: "#6b7280", fontSize: 13 },

  headerRight: { flexDirection: "row", alignItems: "center" },
  userLabel: { fontSize: 12, color: "#6b7280", marginRight: 8 },
  username: { fontSize: 15, fontWeight: "600", color: "#1e3a8a", marginRight: 12 },
  logout: { backgroundColor: "#e0e7ff", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, cursor: Platform.OS === "web" ? "pointer" : undefined },
  logoutHover: { backgroundColor: "#c7d2fe" },
  logoutText: { color: "#1e3a8a", fontWeight: "600" },

  tabsWrap: { width: "100%", flexDirection: "row", alignItems: "center", marginBottom: 12, borderBottomWidth: 1, borderBottomColor: "#e6e9ef", paddingBottom: 10, flexShrink: 0, justifyContent: "flex-start" },
  tab: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, cursor: Platform.OS === "web" ? "pointer" : undefined, marginRight: 12, whiteSpace: "nowrap" },
  tabHover: { backgroundColor: "#f3f5f7" },
  activeTab: { backgroundColor: "#eef2ff", borderBottomWidth: 2, borderBottomColor: "#1e3a8a" },
  tabLabel: { marginLeft: 8, fontSize: 14, color: "#374151", fontWeight: "600" },
  activeLabel: { color: "#1e3a8a" },
});
