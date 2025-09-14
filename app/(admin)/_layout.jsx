import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1e3a8a" }, // blue header
        headerTintColor: "#fff", // white text/icons
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "center",
      }}
    />
  );
}
