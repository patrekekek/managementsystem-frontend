// app/(tabs)/teacher/file-leave.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

import { useLeaves } from "../../../context/LeaveContext";
import { useAuth } from "../../../context/AuthContext";

export default function FileLeave() {
  const { fileLeave } = useLeaves();
  const { user } = useAuth();
  const router = useRouter();

  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    if (!date || !leaveType || !reason) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    // create the new leave request
    fileLeave({
      id: Date.now(), // unique id for mock
      name: user?.name || "Anonymous",
      leaveType,
      reason,
      date,
      status: "Pending", // so admin can approve/reject
    });

    Alert.alert("Success", "Leave filed successfully", [
      {
        text: "OK",
        onPress: () => router.push("/(tabs)/teacher/my-leaves"),
      },
    ]);

    // Reset inputs
    setDate("");
    setLeaveType("");
    setReason("");
  };

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Please login to file a leave</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Leave Type */}
      <Text style={styles.label}>Leave Type</Text>
      {Platform.OS === "ios" ? (
        <>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={{ color: leaveType ? "#000" : "#999" }}>
              {leaveType
                ? leaveType.charAt(0).toUpperCase() + leaveType.slice(1)
                : "Select Leave Type"}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={showModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={{ color: "red", fontWeight: "bold" }}>Close</Text>
                </TouchableOpacity>
                <Picker
                  selectedValue={leaveType}
                  onValueChange={(value) => {
                    setLeaveType(value);
                    setShowModal(false);
                  }}
                >
                  <Picker.Item label="Vacation Leave" value="vacation" color="#000" />
                  <Picker.Item label="Sick Leave" value="sick" color="#000" />
                  <Picker.Item label="Emergency Leave" value="emergency" color="#000" />
                </Picker>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <Picker
          selectedValue={leaveType}
          onValueChange={(value) => setLeaveType(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Leave Type" value="" />
          <Picker.Item label="Vacation Leave" value="vacation" />
          <Picker.Item label="Sick Leave" value="sick" />
          <Picker.Item label="Emergency Leave" value="emergency" />
        </Picker>
      )}

      {/* Reason */}
      <Text style={styles.label}>Reason</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter reason"
        value={reason}
        onChangeText={setReason}
        multiline
      />

      {/* Date */}
      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Leave</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
  },
  pickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
});
