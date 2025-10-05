// app/_layout.jsx
import React, { useEffect } from "react";
import { Stack, Slot } from "expo-router";
import { AuthContextProvider } from "../context/AuthContext";
import { LeaveProvider } from "../context/LeaveContext";

export default function RootLayout() {

  return (
    <AuthContextProvider>
      <LeaveProvider>
        <Slot />
      </LeaveProvider>
    </AuthContextProvider>
  );
}


        // <Stack screenOptions={{ headerShown: false }}>

        //   <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        //   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        //   <Stack.Screen name="(adminTabs)" options={{ headerShown: false }} />
        //   <Stack.Screen
        //     name="leave-details/[id]"
        //     options={{
        //       headerShown: true,
        //       title: "Leave Details",
        //       headerBackTitle: "Back",
        //     }}
        //   />
        // </Stack>