// app/leaves/[id].jsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFetchLeave } from "../../../hooks/useFetchLeave";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { API_URL } from "../../../config";
import { useDownloadExcel } from "../../../hooks/useDownloadExcel";

export default function LeaveView() {
  const { id } = useLocalSearchParams();
  const { leave, loading, error, refetch } = useFetchLeave(id); // Make sure your hook can refetch data
  const [actionLoading, setActionLoading] = useState(false);

  const { downloadExcel } = useDownloadExcel();
  const { user } = useAuthContext();


  const handleAction = async (action) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_URL}/leaves/${id}/${action}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update leave");

      Alert.alert(
        "Success",
        `Leave successfully ${action === "approve" ? "approved" : "rejected"}.`
      );

      await refetch?.(); // refresh data if available
    } catch (err) {
      Alert.alert("Error", err.message);
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

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
      <Text>Status: {leave.status}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.approve]}
          onPress={() => handleAction("approve")}
          disabled={actionLoading}
        >
          {actionLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Approve</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.reject]}
          onPress={() => handleAction("reject")}
          disabled={actionLoading}
        >
          {actionLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Reject</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: "#007AFF",
          padding: 10,
          borderRadius: 8,
        }}
        onPress={() => downloadExcel(`leaves/generate-excel/${id}`, `leave-${id}`)}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Download Excel</Text>
      </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 8 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  approve: { backgroundColor: "#4CAF50" },
  reject: { backgroundColor: "#F44336" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
