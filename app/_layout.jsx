// app/teacher/_layout.jsx
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { View, Text } from "react-native";

export default function TeacherLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#4CAF50" }, // green header
          headerTintColor: "#fff", // white text/icons
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        {/* Screens inside teacher folder */}
        <Stack.Screen 
          name="index" 
          options={{ title: "Teacher Dashboard" }} 
        />
        <Stack.Screen 
          name="leaves" 
          options={{ title: "Leave Requests" }} 
        />
        <Stack.Screen 
          name="profile" 
          options={{ title: "Profile" }} 
        />
      </Stack>
    </SafeAreaView>
  );
}
