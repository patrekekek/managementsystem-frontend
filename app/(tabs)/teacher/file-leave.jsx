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
  const [sickType, setSickType] = useState("");
  const [sickIllness, setSickIllness] = useState("");
  const [studyType, setStudyType] = useState("");
  const [womenIllness, setWomenIllness] = useState("");
  const [othersType, setOthersType] = useState("");
  const [otherReason, setOthersReason] = useState("");

  // pickers & modals
  const [showModal, setShowModal] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());

  // calculate number of days
  const getNumberOfDays = (start, end) => {
    const diffTime = new Date(end) - new Date(start);
    return diffTime >= 0 ? diffTime / (1000 * 60 * 60 * 24) + 1 : 1;
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !leaveType) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const mappedLeaveType = leaveTypeEnumMap[leaveType];

    const leaveData = {
      user: user._id,
      officeDepartment: user.officeDepartment || "Default Dept",
      name: user.name,
      position: user.position || "Teacher",
      salary: user.salary || 0,
      leaveType: mappedLeaveType,
      numberOfDays: getNumberOfDays(startDate, endDate),
      startDate,
      endDate,
      vacation: mappedLeaveType === "vacation" ? { withinPhilippines: vacationWithin, abroad: vacationAbroad } : {},
      sick: mappedLeaveType === "sick" ? { type: sickType, illness: sickIllness } : {},
      study: mappedLeaveType === "study" ? { mastersDegree: studyType === "masters", boardExamReview: studyType === "board" } : {},
      specialWomen: mappedLeaveType === "special-women" ? { illness: womenIllness } : {},
      mandatoryForcedLeave: mappedLeaveType === "mandatory-forced" ? {} : {},
      others: mappedLeaveType === "others" ? { monetization: othersType === "monetization", terminal: othersType === "terminal", reason: otherReason } : {},
    };

    try {
      console.log( "hoy",leaveData)
      await fileLeave(leaveData);
      Alert.alert("Success", "Leave filed successfully", [
        { text: "OK", onPress: () => router.push("/(tabs)/teacher/my-leaves") },
      ]);


      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setVacationWithin("");
      setVacationAbroad("");
      setSickType("");
      setSickIllness("");
      setStudyType("");
      setWomenIllness("");
      setOthersType("");
      setOthersReason("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleAndroidChange = (event, selectedDate, type) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      type === "start" ? setStartDate(formattedDate) : setEndDate(formattedDate);
    }
    type === "start" ? setShowStartPicker(false) : setShowEndPicker(false);
  };

  const renderDatePicker = (type) => {
    const show = type === "start" ? showStartPicker : showEndPicker;
    const tempDate = type === "start" ? tempStartDate : tempEndDate;
    const setTempDate = type === "start" ? setTempStartDate : setTempEndDate;
    const setDate = type === "start" ? setStartDate : setEndDate;
    const setShow = type === "start" ? setShowStartPicker : setShowEndPicker;

    if (Platform.OS === "android") {
      return show && (
        <DateTimePicker
          value={new Date() || new Date()}
          mode="date"
          display="spinner"
          onChange={(e, date) => handleAndroidChange(e, date, type)}
        />
      );
    } else {
      return show && (
        <Modal transparent animationType="slide" visible={show}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                textColor="#000"
                onChange={(e, date) => date && setTempDate(date)}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setDate(tempDate.toISOString().split("T")[0]);
                    setShow(false);
                  }}
                >
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }
  };

  if (!user) {
    return (
      <View style={styles.centered}>
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
          <TouchableOpacity style={styles.pickerButton} onPress={() => setShowModal(true)}>
            <Text style={{ color: leaveType ? "#000" : "#999" }}>{leaveType || "Select Leave Type"}</Text>
          </TouchableOpacity>
          <Modal visible={showModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                  <Text style={{ color: "red", fontWeight: "bold" }}>Close</Text>
                </TouchableOpacity>
                <Picker selectedValue={leaveType} onValueChange={(value) => { setLeaveType(value); setShowModal(false); }}>
                  {leaveList.map((type, i) => <Picker.Item key={i} label={type} value={type} />)}
                </Picker>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <Picker selectedValue={leaveType} onValueChange={setLeaveType} style={styles.picker}>
          {leaveList.map((type, i) => <Picker.Item key={i} label={type} value={type} />)}
        </Picker>
      )}

      {/* Conditional fields */}
      {leaveType === "Vacation Leave" && (
        <>
          <Text style={styles.label}>Vacation Within Philippines</Text>
          <TextInput style={styles.input} placeholder="e.g. Baguio City" value={vacationWithin} onChangeText={setVacationWithin} />
          <Text style={styles.label}>Vacation Abroad</Text>
          <TextInput style={styles.input} placeholder="Leave blank if not applicable" value={vacationAbroad} onChangeText={setVacationAbroad} />
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
          <TextInput style={styles.input} placeholder="Enter illness" value={sickIllness} onChangeText={setSickIllness} />
        </>
      )}

      {leaveType === "Study Leave" && (
        <>
          <Text style={styles.label}>Study Type</Text>
          <Picker selectedValue={studyType} onValueChange={setStudyType}>
            <Picker.Item label="Select Type" value="" />
            <Picker.Item label="Completion of Master’s Degree" value="masters" />
            <Picker.Item label="BAR/Board Exam Review" value="board" />
          </Picker>
        </>
      )}

      {leaveType === "Special Leave Benefits for Women" && (
        <>
          <Text style={styles.label}>Specify Illness</Text>
          <TextInput style={styles.input} placeholder="Enter illness" value={womenIllness} onChangeText={setWomenIllness} />
        </>
      )}

      {leaveType === "Others" && (
        <>
          <Text style={styles.label}>Others Type</Text>
          <Picker selectedValue={othersType} onValueChange={setOthersType}>
            <Picker.Item label="Select Type" value="" />
            <Picker.Item label="Monetization of Leave Credits" value="monetization" />
            <Picker.Item label="Terminal Leave" value="terminal" />
          </Picker>
          <Text style={styles.label}>Specify Reason</Text>
          <TextInput style={styles.input} placeholder="Enter reason" value={otherReason} onChangeText={setOthersReason} />
        </>
      )}

      {/* Start & End Dates */}
      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity style={styles.dateBox} onPress={() => { setShowStartPicker(true); setTempStartDate(startDate ? new Date(startDate) : new Date()); }}>
        <Text style={styles.dateText}>{startDate || "Select start date"}</Text>
      </TouchableOpacity>
      {renderDatePicker("start")}

      <Text style={styles.label}>End Date</Text>
      <TouchableOpacity style={styles.dateBox} onPress={() => { setShowEndPicker(true); setTempEndDate(endDate ? new Date(endDate) : new Date()); }}>
        <Text style={styles.dateText}>{endDate || "Select end date"}</Text>
      </TouchableOpacity>
      {renderDatePicker("end")}

      {/* Submit */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Leave</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  label: { fontSize: 16, marginBottom: 5, color: "#333", fontWeight: "500" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 15, backgroundColor: "#fff" },
  picker: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 15 },
  pickerButton: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, backgroundColor: "#fff", marginBottom: 15 },
  button: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  closeButton: { alignSelf: "flex-end", marginBottom: 10 },
  dateBox: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 15 },
  dateText: { fontSize: 16, color: "#333" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  cancelText: { color: "red", fontSize: 16 },
  doneText: { color: "blue", fontSize: 16, fontWeight: "bold" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
