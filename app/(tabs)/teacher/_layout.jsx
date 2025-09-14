import { Stack } from "expo-router";

export default function TeacherLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#4CAF50" }, // green header
        headerTintColor: "#fff", // white text/icons
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "center", // center title
      }}
    />
  );
}
