import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth(); // you already have AuthContext

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to JLNHS Leave Management App, Cher!</Text>
      <Text style={styles.subtitle}>
        Please log in or register.
      </Text>

      {!user ? (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push("/auth/register")}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.welcome}>Hello, {user?.name?.first ?? user?.email ?? "User"}!</Text>

          {user.role === "teacher" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/(tabs)/teacher")}
            >
              <Text style={styles.buttonText}>Go to Teacher Dashboard</Text>
            </TouchableOpacity>
          )}

          {user.role === "admin" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/admin/leave-requests")}
            >
              <Text style={styles.buttonText}>Go to Admin Dashboard</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  welcome: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
    width: "80%",
  },
  secondaryButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
