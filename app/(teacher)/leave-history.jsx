import { View, Text, StyleSheet } from "react-native";

export default function LeaveHistoryPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave History</Text>
      <Text style={styles.subtitle}>View all your past leave records here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 16, color: "#6b7280", marginTop: 8 },
});
