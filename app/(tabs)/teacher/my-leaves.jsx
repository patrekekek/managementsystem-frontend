import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import LeaveCard from "../../../components/LeaveCard";
import useFetchTeacherLeaves from "../../../hooks/useFetchTeacherLeaves";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function MyLeaves() {
  const { leaves, loading, error } = useFetchTeacherLeaves();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>❌ {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 My Leaves</Text>

      <FlatList
        data={leaves}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/leave-details/[id]",
                params: { id: item._id }, // pass leave id
              })
            }
          >
            <LeaveCard
              type={item.leaveType}
              date={new Date(item.startDate).toLocaleDateString()}
              status={item.status || "Pending"}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No leave records found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  empty: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
