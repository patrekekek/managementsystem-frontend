import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="teacher/dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="teacher/file-leave" options={{ title: "File Leave" }} />
      <Tabs.Screen name="teacher/leave-history" options={{ title: "Leave History" }} />
      <Tabs.Screen name="teacher/my-leaves" options={{ title: "My Leaves" }} />
    </Tabs>
  );
}
