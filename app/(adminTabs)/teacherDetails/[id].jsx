import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../config";
import { useRouter } from "expo-router";

export default function TeacherDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [teacher, setTeacher] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const { token } = JSON.parse(storedUser);

        const res = await fetch(`${API_URL}/leaves/teachers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setTeacher(data.teacher);
        setLeaves(data.leaves || []);
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  if (!teacher) return <Text style={styles.centerText}>No teacher found.</Text>;

  return (
    <FlatList
      scrollEnabled
      ListHeaderComponent={
        <>
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri:
                  teacher.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>
              {teacher?.name?.first}{" "}
              {teacher?.name?.middle ? teacher.name.middle[0] + ". " : ""}
              {teacher?.name?.last}
            </Text>
            <Text style={styles.department}>{teacher.office_department}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Info</Text>
            <Text>Email: {teacher.email || "N/A"}</Text>
            <Text>Username: {teacher.username || "N/A"}</Text>
            <Text>Role: {teacher.role || "N/A"}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Info</Text>
            <Text>Position: {teacher.position || "N/A"}</Text>
            <Text>Department: {teacher.office_department || "N/A"}</Text>
            <Text>Status: {teacher.bio || "N/A"}</Text>
            <Text>Salary: {teacher.salary || "N/A"}</Text>
          </View>

          <Text style={styles.sectionTitle}>Leave History</Text>
        </>
      }
      data={leaves}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push(`/(adminTabs)/leaveDetails/${item._id}`)}
        >
          <View style={styles.leaveCard}>
            <Text style={styles.leaveType}>{item.leaveType}</Text>
            <Text>Status: {item.status}</Text>
            <Text>From: {new Date(item.startDate).toLocaleDateString()}</Text>
            <Text>To: {new Date(item.endDate).toLocaleDateString()}</Text>
            {item.reason && <Text>Reason: {item.reason}</Text>}
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={styles.leaveItem}>No leave records found.</Text>
      }
      ListFooterComponent={<View style={{ height: 50 }} />}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 16 },
  profileContainer: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  department: { fontSize: 16, color: "gray", textAlign: "center" },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  leaveItem: { fontSize: 16, paddingVertical: 4, textAlign: "center" },
  leaveCard: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  leaveType: { fontSize: 16, fontWeight: "bold" },
  centerText: { textAlign: "center", marginTop: 50, fontSize: 18 },
  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
});
