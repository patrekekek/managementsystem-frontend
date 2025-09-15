// app/index.jsx
import { StyleSheet, View, Text } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  const navItems = [
    { label: "Login", path: "/auth/login" },
    { label: "Register", path: "/auth/register" },
    { label: "Teacher Dashboard", path: "/(tabs)/teacher/dashboard" },
    { label: "Teacher File Leave", path: "/(tabs)/teacher/file-leave" },
    { label: "Teacher Leave History", path: "/(tabs)/teacher/leave-history" },
    { label: "Teacher My Leaves", path: "/(tabs)/teacher/my-leaves" },
    { label: "Admin Dashboard", path: "/admin/dashboard" },
    { label: "Admin Leave Details", path: "/admin/leave-details" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Test Navigation</Text>

      {navItems.map((item, index) => (
        <Link key={index} href={item.path} style={styles.button}>
          <Text style={styles.buttonText}>{item.label}</Text>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
