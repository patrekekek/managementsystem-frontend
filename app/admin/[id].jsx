// app/leaves/[id].jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFetchLeave } from "../../hooks/useFetchLeave";

export default function LeaveView() {
  const { id } = useLocalSearchParams();
  const { leave, loading, error } = useFetchLeave(id);

  console.log("oten", leave);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error fetching leave.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave Details</Text>
      <Text>Name: {leave.name.last}, {leave.name.first}</Text>
      <Text>Type: {leave.leaveType}</Text>
      <Text>Start Date: {leave.startDate}</Text>
      <Text>End Date: {leave.endDate}</Text>
      <Text>Reason: {leave.reason}</Text>
      {/* add more fields as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 8 },
});
