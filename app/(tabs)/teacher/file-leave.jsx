import { View, Text, StyleSheet } from "react-native";

export default function FileLeavePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>File a Leave</Text>
      <Text style={styles.subtitle}>Here you can file your leave request.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 16, color: "#6b7280", marginTop: 8 },
});
