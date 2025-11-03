import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useLeaveContext } from "../../../hooks/useLeaveContext";
import { useDownloadExcel } from "../../../hooks/useDownloadExcel";

export default function LeaveView() {
  const { id } = useLocalSearchParams();
  const { leaves, approveLeave, rejectLeave, loading } = useLeaveContext();
  const [actionLoading, setActionLoading] = useState(false);
  const { downloadExcel } = useDownloadExcel();


  const leave = useMemo(() => leaves.find((l) => l._id === id), [leaves, id]);


  const handleAction = async (action) => {
    setActionLoading(true);
    try {
      if (action === "approve") await approveLeave(id);
      else await rejectLeave(id);

      Alert.alert(
        "Success",
        `Leave successfully ${action === "approve" ? "approved" : "rejected"}.`
      );
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Text>Loading leaves...</Text>;
  if (!leave) return <Text>Leave not found.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave Details</Text>
      <Text>
        Name: {leave.name.last}, {leave.name.first}
      </Text>
      <Text>Type: {leave.leaveType}</Text>
      <Text>
        Start Date: {new Date(leave.startDate).toLocaleDateString()}
      </Text>
      <Text>
        End Date: {new Date(leave.endDate).toLocaleDateString()}
      </Text>
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
        style={styles.excelButton}
        onPress={() =>
          downloadExcel(`leaves/generate-excel/${id}`, `leave-${id}`)
        }
      >
        <Text style={styles.excelText}>Download Excel</Text>
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
  excelButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
  },
  excelText: { color: "#fff", textAlign: "center" },
});
