import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../config";


import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";


export default function LeaveDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        const { token } = JSON.parse(userData);

        const res = await fetch(`${API_URL}/leaves/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allLeaves = await res.json();

        // find specific leave
        const found = allLeaves.find((l) => l._id === id);
        setLeave(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeave();
  }, [id]);

  const handleDownload = async (id) => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const { token } = JSON.parse(userData);

      const downloadURL =  `${API_URL}/leaves/generate-excel/${id}`;
      const fileUri = FileSystem.documentDirectory + `leave-${id}.xlsx`;

      const response = await FileSystem.downloadAsync(downloadURL, fileUri, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("File downloaded to:", response.uri);


      //share dialogue
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(response.uri);
      } else {
        alert("Sharing not available on this device")
      }

    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download the Excel file")
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!leave) {
    return (
      <View style={styles.center}>
        <Text>Leave not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* ✅ Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Leave Details</Text>

      <Text style={styles.label}>Type:</Text>
      <Text style={styles.value}>{leave.leaveType}</Text>

      <Text style={styles.label}>Office/Dept:</Text>
      <Text style={styles.value}>{leave.officeDepartment}</Text>

      <Text style={styles.label}>Position:</Text>
      <Text style={styles.value}>{leave.position}</Text>

      <Text style={styles.label}>Salary:</Text>
      <Text style={styles.value}>{leave.salary}</Text>

      <Text style={styles.label}>Start Date:</Text>
      <Text style={styles.value}>
        {new Date(leave.startDate).toLocaleDateString()}
      </Text>

      <Text style={styles.label}>End Date:</Text>
      <Text style={styles.value}>
        {new Date(leave.endDate).toLocaleDateString()}
      </Text>

      <Text style={styles.label}>Number of Days:</Text>
      <Text style={styles.value}>{leave.numberOfDays}</Text>

      <Text style={styles.label}>Status:</Text>
      <Text style={styles.value}>{leave.status}</Text>

      {/* conditional fields */}
      {leave.leaveType === "sick" && (
        <>
          <Text style={styles.label}>Illness:</Text>
          <Text style={styles.value}>{leave.sick?.illness || "N/A"}</Text>
        </>
      )}

      {leave.leaveType === "vacation" && (
        <>
          <Text style={styles.label}>Within Philippines:</Text>
          <Text style={styles.value}>
            {leave.vacation?.withinPhilippines || "-"}
          </Text>

          <Text style={styles.label}>Abroad:</Text>
          <Text style={styles.value}>{leave.vacation?.abroad || "-"}</Text>
        </>
      )}

      {leave.leaveType === "study" && (
        <>
          <Text style={styles.label}>Masters Degree:</Text>
          <Text style={styles.value}>
            {leave.study?.mastersDegree ? "Yes" : "No"}
          </Text>

          <Text style={styles.label}>Board Exam Review:</Text>
          <Text style={styles.value}>
            {leave.study?.boardExamReview ? "Yes" : "No"}
          </Text>
        </>
      )}

      {leave.leaveType === "others" && (
        <>
          <Text style={styles.label}>Monetization:</Text>
          <Text style={styles.value}>
            {leave.others?.monetization ? "Yes" : "No"}
          </Text>

          <Text style={styles.label}>Terminal:</Text>
          <Text style={styles.value}>
            {leave.others?.terminal ? "Yes" : "No"}
          </Text>
        </>
      )}

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: "#007AFF",
          padding: 10,
          borderRadius: 8,
        }}
        onPress={() => handleDownload(leave._id)}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Download Excel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backText: {
    fontSize: 16,
    marginLeft: 6,
    color: "#333",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontSize: 16, fontWeight: "600", marginTop: 10, color: "#333" },
  value: { fontSize: 16, color: "#555" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
