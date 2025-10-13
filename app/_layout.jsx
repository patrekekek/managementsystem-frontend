import React from "react";
import { Stack } from "expo-router";
import { AuthContextProvider } from "../context/AuthContext";
import { LeaveProvider } from "../context/LeaveContext";

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <LeaveProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* 👇 SplashScreen will appear first when app opens */}
          <Stack.Screen name="SplashScreen" />

          {/* Authentication flow */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />

          {/* Tabs for teacher users */}
          <Stack.Screen name="(tabs)/teacher" options={{ headerShown: false }} />

          {/* Tabs for admin users */}
          <Stack.Screen name="(adminTabs)" options={{ headerShown: false }} />

          {/* Leave details for both admin/teacher */}
          <Stack.Screen
            name="leave-details/[id]"
            options={{
              headerShown: true,
              title: "Leave Details",
              headerBackTitle: "Back",
            }}
          />
        </Stack>
      </LeaveProvider>
    </AuthContextProvider>
  );
}
