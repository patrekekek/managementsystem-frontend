import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAuthContext } from "../../hooks/useAuthContext";
import AdminWebTabs from "../../components/AdminWebTabs";
import ProfileForm from "../../components/ProfileForm";

const MAX_SHELL_WIDTH = 1200;
const HORIZONTAL_PADDING = 20;

export default function AdminProfileWeb() {
  const { user } = useAuthContext();

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View
        style={[
          styles.shell,
          { maxWidth: MAX_SHELL_WIDTH, paddingHorizontal: HORIZONTAL_PADDING },
        ]}
      >
        <AdminWebTabs />

        <View style={styles.card}>
          <Text style={styles.heading}>Admin Profile</Text>

          <ProfileForm user={user} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 28,
    backgroundColor: "#eef2ff", // admin-themed light indigo
  },
  shell: {
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(10,20,30,0.06)",
    marginBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1e3a8a", // admin indigo
  },
});
