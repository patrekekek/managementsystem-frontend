import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuthContext } from "../../../hooks/useAuthContext";

import TeacherWebTabs from "../../../components/TeacherWebTabs";
import ProfileFormWeb from "../../../components/ProfileFormWeb";


const MAX_SHELL_WIDTH = 1000;
const HORIZONTAL_PADDING = 20;

export default function TeacherProfileWeb() {
  const { user } = useAuthContext();

  return (
    <View style={styles.page}>
      <View
        style={[
          styles.shell,
          { maxWidth: MAX_SHELL_WIDTH, paddingHorizontal: HORIZONTAL_PADDING },
        ]}
      >
        <TeacherWebTabs />

        <View style={styles.card}>
          <Text style={styles.title}> My Profile</Text>


          <ProfileFormWeb user={user} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    paddingVertical: 28,
    alignItems: "center",
  },

  shell: {
    width: "100%",
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(10,20,30,0.08)",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#0f172a",
  },
});
