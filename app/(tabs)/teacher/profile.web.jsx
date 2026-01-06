import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuthContext } from "../../../hooks/useAuthContext";

import TeacherWebTabs from "../../../components/TeacherWebTabs";
import ProfileFormWeb from "../../../components/ProfileFormWeb";
import WebPage from "../../../components/WebPage";

export default function TeacherProfileWeb() {
  const { user } = useAuthContext();

  return (
    <WebPage>
      <TeacherWebTabs />

      <View style={styles.cardWrap}>
        <View style={styles.card}>
          <Text style={styles.title}>My Profile</Text>
          <ProfileFormWeb user={user} />
        </View>
      </View>
    </WebPage>
  );
}


const styles = StyleSheet.create({
  cardWrap: {
    width: "100%",
    maxWidth: 1000,
    marginHorizontal: "auto",
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#0f172a",
  },
});
