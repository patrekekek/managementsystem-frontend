import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Index() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // navigate to dashboard or tabs layout
        router.replace("/(tabs)/teacher/dashboard");
      } else {
        // go to login page
        router.replace("/(auth)/login");
      }
    }
  }, [user, loading]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
