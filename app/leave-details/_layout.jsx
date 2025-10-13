// app/leave-details/_layout.jsx
import { Stack } from "expo-router";
import React from "react";

export default function LeaveDetailsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="[id]" options={{ title: "Leave Details" }} />
    </Stack>
  );
}
