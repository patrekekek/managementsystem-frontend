import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";

export default function TeacherDetails() {
  const { id } = useLocalSearchParams();
  const [teacher, setTeacher] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  if (!teacher) return <Text>No teacher found.</Text>;

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>
        {teacher?.name?.first} {teacher?.name?.last}
      </Text>
      <Text style={styles.subtitle}>{teacher.office_department}</Text>

      <Text style={styles.sectionTitle}>Leave History</Text>
      {leaves.length === 0 ? (
        <Text style={styles.leaveItem}>No leave records found.</Text>
      ) : (
        <FlatList
          data={leaves}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Text style={styles.leaveItem}>
              {item.leaveType} - {item.status}
            </Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { fontSize: 16, color: "gray", marginBottom: 10 },
  sectionTitle: { marginTop: 16, fontWeight: "bold", fontSize: 18 },
  leaveItem: { paddingVertical: 4, fontSize: 16 },
});
