import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuthContext } from "../../../hooks/useAuthContext";
import ProfileForm from "../../../components/ProfileForm";

export default function TeacherProfile() {
  const { user } = useAuthContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 My Profile</Text>
      <ProfileForm user={user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
});
