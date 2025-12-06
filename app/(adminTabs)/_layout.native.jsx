import React, { useCallback, memo } from "react";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, TouchableOpacity, StyleSheet } from "react-native";

const BackButton = memo(function BackButton() {
  const router = useRouter();
  const onPress = useCallback(() => router.back(), [router]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.backBtn}>
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
  );
});


const commonScreenOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: "#007AFF" },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "bold" },
  headerLeft: () => <BackButton />,

  tabBarActiveTintColor: "#007AFF",
  tabBarInactiveTintColor: "gray",
  tabBarStyle: {
    paddingBottom: Platform.OS === "ios" ? 10 : 6,
    height: 70,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
};


const tabOptions = (title, iconName) => ({
  title,
  tabBarIcon: ({ color, size }) => (
    <Ionicons name={iconName} color={color} size={size} />
  ),
});

export default function AdminTabsLayout() {
  return (
    <Tabs screenOptions={commonScreenOptions}>
      <Tabs.Screen name="dashboard" options={tabOptions("Dashboard", "speedometer-outline")} />
      <Tabs.Screen name="leaves" options={tabOptions("Leaves", "document-text-outline")} />
      <Tabs.Screen name="manageTeachers" options={tabOptions("Teachers", "people-outline")} />
      <Tabs.Screen name="profile" options={tabOptions("Profile", "person-circle-outline")} />

      <Tabs.Screen
        name="leaveDetails/[id]"
        options={{
          href: null,
          title: "Leave Details",
        }}
      />

      <Tabs.Screen
        name="teacherDetails/[id]"
        options={{
          href: null,
          title: "Teacher Details",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 6,
  },
});
