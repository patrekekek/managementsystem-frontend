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

// hooks
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useFileLeave } from "../../../hooks/useFileLeave";

// constants
import { leaveList, leaveTypeEnumMap } from "../../../constants/leaveList";



export default function FileLeave() {
  const { user } = useAuthContext();
  const { fileLeave } = useFileLeave();
  const router = useRouter();

  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // special fields
  const [vacationWithin, setVacationWithin] = useState("");
  const [vacationAbroad, setVacationAbroad] = useState("");
  const [sickType, setSickType] = useState(""); // hospital or outpatient
  const [sickIllness, setSickIllness] = useState("");
  const [studyType, setStudyType] = useState(""); // master’s / board
  const [othersType, setOthersType] = useState(""); // monetization / terminal
  const [womenIllness, setWomenIllness] = useState("");

  const [showModal, setShowModal] = useState(false);


  const getNumberOfDays = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const diffTime = endDateObj - startDateObj;
    return diffTime > 0 ? diffTime / (1000 * 60 * 60 * 24) + 1 : 1;
  };

  //for testing
  const sampleSubmit = () => {
    console.log("user", user)

    const leaveData = {
      user: user._id, // get from backend if possible
      officeDepartment: user.officeDepartment || "Default Dept",
      name: {
        first: user.name.first,
        last: user.name.last,
        middle: user.name.middle || ""
      },
      position: user.position || "Teacher",
      salary: user.salary || 0,
      leaveType: leaveTypeEnumMap[leaveType],
      numberOfDays: getNumberOfDays(startDate, endDate),
      startDate,
      endDate,
      vacation:
        leaveType === "Vacation Leave"
          ? { withinPhilippines: vacationWithin, abroad: vacationAbroad }
          : {},
      sick:
        leaveType === "Sick Leave"
          ? { type: sickType, illness: sickIllness }
          : {},
      study:
        leaveType === "Study Leave"
          ? { mastersDegree: studyType === "masters", boardExamReview: studyType === "board" }
          : {},
      others:
        leaveType === "Others"
          ? { monetization: othersType === "monetization", terminal: othersType === "terminal" }
          : {}
    };

    console.log(leaveData);
  }

  const handleSubmit = async () => {
    if (!startDate || !endDate || !leaveType) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const leaveData = {
      user: user._id,
      officeDepartment: user.officeDepartment || "Default Dept",
      name: {
        first: user.name.first,
        last: user.name.last,
        middle: user.name.middle || ""
      },
      position: user.position || "Teacher",
      salary: user.salary || 0,
      leaveType: leaveTypeEnumMap[leaveType],
      numberOfDays: getNumberOfDays(startDate, endDate),
      startDate,
      endDate,
      vacation:
        leaveType === "Vacation Leave"
          ? { withinPhilippines: vacationWithin, abroad: vacationAbroad }
          : {},
      sick:
        leaveType === "Sick Leave"
          ? { type: sickType, illness: sickIllness }
          : {},
      study:
        leaveType === "Study Leave"
          ? { mastersDegree: studyType === "masters", boardExamReview: studyType === "board" }
          : {},
      others:
        leaveType === "Others"
          ? { monetization: othersType === "monetization", terminal: othersType === "terminal" }
          : {}
    };



    console.log("bilat", leaveData);

    try {
      await fileLeave(leaveData);

      Alert.alert("Success", "Leave filed successfully", [
        { text: "OK", onPress: () => router.push("/(tabs)/teacher/my-leaves") },
      ]);

      // reset
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setVacationWithin("");
      setVacationAbroad("");
      setSickType("");
      setSickIllness("");
      setStudyType("");
      setOthersType("");
      setWomenIllness("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
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
              {leaveType || "Select Leave Type"}
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
                  {leaveList.map((type, index) => (
                    <Picker.Item
                      key={index}
                      label={type}
                      value={type}
                      color="#000"
                    />
                  ))}
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
          {leaveList.map((type, index) => (
            <Picker.Item key={index} label={type} value={type} color="#000" />
          ))}
        </Picker>
      )}

      {/* Conditional fields */}
      {leaveType === "Vacation Leave" && (
        <>
          <Text style={styles.label}>Vacation Within Philippines</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Baguio City"
            value={vacationWithin}
            onChangeText={setVacationWithin}
          />
          <Text style={styles.label}>Vacation Abroad</Text>
          <TextInput
            style={styles.input}
            placeholder="Leave blank if not applicable"
            value={vacationAbroad}
            onChangeText={setVacationAbroad}
          />
        </>
      )}

      {leaveType === "Sick Leave" && (
        <>
          <Text style={styles.label}>Sick Type</Text>
          <Picker selectedValue={sickType} onValueChange={setSickType}>
            <Picker.Item label="Select Type" value="" />
            <Picker.Item label="In Hospital" value="hospital" />
            <Picker.Item label="Out Patient" value="outpatient" />
          </Picker>
          <Text style={styles.label}>Specify Illness</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter illness"
            value={sickIllness}
            onChangeText={setSickIllness}
          />
        </>
      )}

      {leaveType === "Study Leave" && (
        <>
          <Text style={styles.label}>Study Type</Text>
          <Picker selectedValue={studyType} onValueChange={setStudyType}>
            <Picker.Item label="Select Type" value="" />
            <Picker.Item
              label="Completion of Master’s Degree"
              value="masters"
            />
            <Picker.Item label="BAR/Board Exam Review" value="board" />
          </Picker>
        </>
      )}

      {leaveType === "Special Leave Benefits for Women" && (
        <>
          <Text style={styles.label}>Specify Illness</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter illness"
            value={womenIllness}
            onChangeText={setWomenIllness}
          />
        </>
      )}

      {leaveType === "Others" && (
        <>
          <Text style={styles.label}>Others Type</Text>
          <Picker selectedValue={othersType} onValueChange={setOthersType}>
            <Picker.Item label="Select Type" value="" />
            <Picker.Item
              label="Monetization of Leave Credits"
              value="monetization"
            />
            <Picker.Item label="Terminal Leave" value="terminal" />
          </Picker>
        </>
      )}

      {/* Reason */}
      {/* <Text style={styles.label}>Reason</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter reason"
        value={reason}
        onChangeText={setReason}
        multiline
      /> */}

      {/* Start & End Dates */}
      <Text style={styles.label}>Start Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={startDate}
        onChangeText={setStartDate}
      />

      <Text style={styles.label}>End Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={endDate}
        onChangeText={setEndDate}
      />

      {/* Submit */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Leave</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  label: { fontSize: 16, marginBottom: 5, color: "#333" },
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
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
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
  closeButton: { alignSelf: "flex-end", marginBottom: 10 },
});
