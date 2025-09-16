import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { LeaveProvider } from "../context/LeaveContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LeaveProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Expo Router auto-detects all routes */}
        </Stack>
      </LeaveProvider> 
    </AuthProvider>
  );
}
