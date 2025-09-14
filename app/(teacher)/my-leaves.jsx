import { View, Text, StyleSheet } from "react-native";

export default function MyLeavesPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Leaves</Text>
      <Text style={styles.subtitle}>See your approved and pending leaves.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 16, color: "#6b7280", marginTop: 8 },
});
