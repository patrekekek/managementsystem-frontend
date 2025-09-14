import { View, Text, StyleSheet } from "react-native";

export default function LeaveDetails() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave Details</Text>
      <Text>Here you can view and approve/reject leave applications.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
