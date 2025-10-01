// app/_layout.jsx
import { Stack, Slot, useRouter } from "expo-router";
import { AuthContextProvider } from "../context/AuthContext";
import { LeaveProvider } from "../context/LeaveContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect } from "react";

function RootNavigation() {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Expo Router auto-detects routes */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen
        name="leave-details/[id]"
        options={{
          headerShown: true,
          title: "Leave Details",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <LeaveProvider>
        <RootNavigation />
      </LeaveProvider>
    </AuthContextProvider>
  );
}
