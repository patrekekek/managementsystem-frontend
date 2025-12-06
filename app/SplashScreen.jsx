import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuthContext } from "../hooks/useAuthContext"; // adjust path

export default function SplashScreen() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {

      const t = setTimeout(() => {
        if (user) {
          router.replace("/");
        } else {
          router.replace("/login");
        }
      }, 600);

      return () => clearTimeout(t);
    }
  }, [authLoading, user, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={Platform.OS === "web" ? 50 : "large"}
        color="#2563eb"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
