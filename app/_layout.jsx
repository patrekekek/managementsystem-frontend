
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack
        // screenOptions={{
        //   headerStyle: { backgroundColor: "#4CAF50" }, // green header
        //   headerTintColor: "#fff", // white text/icons
        //   headerTitleStyle: { fontWeight: "bold" },
        // }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="teacher" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="/search/[query]" options={{ headerShown: true }} /> */}
      </Stack>
    </SafeAreaView>
  );
}
