// app/leaves/LeaveDetails.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useFetchAllLeaves } from "../../hooks/useFetchAllLeaves";

export default function LeaveDetails() {
  const router = useRouter();
  const { leaves, loading, error } = useFetchAllLeaves();

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading leaves.</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={leaves}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push(`/(adminTabs)/${item._id}`)} // navigate to detail page
          >
            <Text style={styles.title}>
              {item.name.last}, {item.name.first}
            </Text>

            <Text style={styles.text}>Type: {item.leaveType}</Text>
            <Text style={styles.text}>
              Duration: {new Date(item.startDate).toLocaleDateString()} →{" "}
              {new Date(item.endDate).toLocaleDateString()}
            </Text>
            <Text
              style={[
                styles.status,
                item.status === "approved"
                  ? styles.approved
                  : item.status === "rejected"
                  ? styles.rejected
                  : styles.pending,
              ]}
            >
              Status: {item.status}
            </Text>
          </TouchableOpacity>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  title: { fontWeight: "bold" },
});
