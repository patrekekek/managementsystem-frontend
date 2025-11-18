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
import DateTimePicker from "@react-native-community/datetimepicker";


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

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());

  const getNumberOfDays = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const diffTime = endDateObj - startDateObj;
    return diffTime > 0 ? diffTime / (1000 * 60 * 60 * 24) + 1 : 1;
  };


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
      mandatoryForcedLeave:
        leaveType === "mandatory-forced"
        ? {}
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

  const handleAndroidChange = (event, selectedDate, type) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      if (type === "start") setStartDate(formattedDate);
      else setEndDate(formattedDate);
    }
    if (type === "start") setShowStartPicker(false);
    else setShowEndPicker(false);
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
    <View style={styles.container}>
      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity
        onPress={() => {
          setShowStartPicker(true);
          setTempStartDate(startDate ? new Date(startDate) : new Date());
        }}
        style={styles.dateBox}
      >
        <Text style={styles.dateText}>
          {startDate ? startDate : "Select start date"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>End Date</Text>
      <TouchableOpacity
        onPress={() => {
          setShowEndPicker(true);
          setTempEndDate(endDate ? new Date(endDate) : new Date());
        }}
        style={styles.dateBox}
      >
        <Text style={styles.dateText}>
          {endDate ? endDate : "Select end date"}
        </Text>
      </TouchableOpacity>

      {/* Android Pickers */}
      {showStartPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={startDate ? new Date(startDate) : new Date()}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) =>
            handleAndroidChange(event, selectedDate, "start")
          }
        />
      )}

      {showEndPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={endDate ? new Date(endDate) : new Date()}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) =>
            handleAndroidChange(event, selectedDate, "end")
          }
        />
      )}

      {/* iOS Start Picker */}
      {showStartPicker && Platform.OS === "ios" && (
        <Modal transparent animationType="slide" visible={showStartPicker}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={tempStartDate}
                  mode="date"
                  display="spinner"
                  themeVariant="light" // ensures visible text
                  textColor="#000" // visible even if system dark mode
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setTempStartDate(selectedDate);
                  }}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setShowStartPicker(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const formattedDate = tempStartDate.toISOString().split("T")[0];
                    setStartDate(formattedDate);
                    setShowStartPicker(false);
                  }}
                >
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* iOS End Picker */}
      {showEndPicker && Platform.OS === "ios" && (
        <Modal transparent animationType="slide" visible={showEndPicker}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={tempEndDate}
                  mode="date"
                  display="spinner"
                  themeVariant="light"
                  textColor="#000"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setTempEndDate(selectedDate);
                  }}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setShowEndPicker(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const formattedDate = tempEndDate.toISOString().split("T")[0];
                    setEndDate(formattedDate);
                    setShowEndPicker(false);
                  }}
                >
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>



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
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  cancelText: {
    color: "red",
    fontSize: 16,
  },
  doneText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },
  dateBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelText: {
    color: "red",
    fontSize: 16,
  },
  doneText: {
    color: "blue",
    fontSize: 16,
  },
});
