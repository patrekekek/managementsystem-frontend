// app/_layout.jsx
import { Stack } from "expo-router";
import { AuthContextProvider } from "../context/AuthContext";
import { LeaveProvider } from "../context/LeaveContext";

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <LeaveProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Expo Router will auto-detect routes */}
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
      </LeaveProvider>
    </AuthContextProvider>
  );
}
