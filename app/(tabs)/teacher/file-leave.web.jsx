import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import { useAuthContext } from "../../../hooks/useAuthContext";
import { useFileLeave } from "../../../hooks/useFileLeave";

import { leaveList, leaveTypeEnumMap } from "../../../constants/leaveList";

import TeacherWebTabs from "../../../components/TeacherWebTabs";

export default function FileLeaveWeb() {
  const { user } = useAuthContext();
  const { fileLeave } = useFileLeave();
  const router = useRouter();

  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const [vacationWithin, setVacationWithin] = useState("");
  const [vacationAbroad, setVacationAbroad] = useState("");
  const [sickType, setSickType] = useState("");
  const [sickIllness, setSickIllness] = useState("");
  const [studyType, setStudyType] = useState("");
  const [womenIllness, setWomenIllness] = useState("");
  const [othersType, setOthersType] = useState("");
  const [otherReason, setOthersReason] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setVacationWithin("");
    setVacationAbroad("");
    setSickType("");
    setSickIllness("");
    setStudyType("");
    setWomenIllness("");
    setOthersType("");
    setOthersReason("");
  }, [leaveType]);

  const getNumberOfDays = (start, end) => {
    if (!start || !end) return 1;
    const diffTime = new Date(end) - new Date(start);
    return diffTime >= 0 ? diffTime / (1000 * 60 * 60 * 24) + 1 : 1;
  };

  const showSuccess = () => {
    if (Platform.OS === "web") {
      window.alert("Leave filed successfully!");
    } else {
      Alert.alert("Success", "Leave filed successfully");
    }
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !leaveType) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const mappedLeaveType = leaveTypeEnumMap[leaveType] || leaveType;

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
      vacation:
        mappedLeaveType === "vacation"
          ? { withinPhilippines: vacationWithin, abroad: vacationAbroad }
          : {},
      sick:
        mappedLeaveType === "sick"
          ? { type: sickType, illness: sickIllness }
          : {},
      study:
        mappedLeaveType === "study"
          ? { mastersDegree: studyType === "masters", boardExamReview: studyType === "board" }
          : {},
      specialWomen: mappedLeaveType === "special-women" ? { illness: womenIllness } : {},
      mandatoryForcedLeave: mappedLeaveType === "mandatory-forced" ? {} : {},
      others:
        mappedLeaveType === "others"
          ? { monetization: othersType === "monetization", terminal: othersType === "terminal", reason: otherReason }
          : {},
    };

    try {
      setSubmitting(true);
      await fileLeave(leaveData);

      showSuccess();
      router.push("/(tabs)/teacher/my-leaves")
      
      // reset
      setLeaveType("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      Alert.alert("Error", err?.message || "Failed to file leave");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>Please log in to file a leave</Text>
      </View>
    );
  }


  const DateInput = ({ value, onChange, name }) => {
    if (Platform.OS === "web") {

      return (
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={webStyles.htmlDate}
          name={name}
        />
      );
    }

    return (
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="YYYY-MM-DD"
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.shell}>
        
        <TeacherWebTabs />

        <View style={styles.card}>
          <Text style={styles.heading}>File a Leave</Text>

          <View style={styles.row}>
            <label style={webStyles.label}>Leave Type *</label>
            {/* web select */}
            {Platform.OS === "web" ? (
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                style={webStyles.select}
              >
                <option value="">Select leave type</option>
                {leaveList.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            ) : (
              // fallback mobile select (not expected in web)
              <TextInput style={styles.input} value={leaveType} onChangeText={setLeaveType} />
            )}
          </View>

          {/* Conditional fields */}
          {leaveType === "Vacation Leave" && (
            <>
              <View style={styles.row}>
                <label style={webStyles.label}>Vacation Within Philippines</label>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Baguio City"
                  value={vacationWithin}
                  onChangeText={setVacationWithin}
                />
              </View>

              <View style={styles.row}>
                <label style={webStyles.label}>Vacation Abroad</label>
                <TextInput
                  style={styles.input}
                  placeholder="Leave blank if not applicable"
                  value={vacationAbroad}
                  onChangeText={setVacationAbroad}
                />
              </View>
            </>
          )}

          {leaveType === "Sick Leave" && (
            <>
              <View style={styles.row}>
                <label style={webStyles.label}>Sick Type</label>
                <select
                  value={sickType}
                  onChange={(e) => setSickType(e.target.value)}
                  style={webStyles.select}
                >
                  <option value="">Select Type</option>
                  <option value="hospital">In Hospital</option>
                  <option value="outpatient">Out Patient</option>
                </select>
              </View>

              <View style={styles.row}>
                <label style={webStyles.label}>Specify Illness</label>
                <TextInput
                  style={styles.input}
                  placeholder="Enter illness"
                  value={sickIllness}
                  onChangeText={setSickIllness}
                />
              </View>
            </>
          )}

          {leaveType === "Study Leave" && (
            <View style={styles.row}>
              <label style={webStyles.label}>Study Type</label>
              <select
                value={studyType}
                onChange={(e) => setStudyType(e.target.value)}
                style={webStyles.select}
              >
                <option value="">Select Type</option>
                <option value="masters">Completion of Master's Degree</option>
                <option value="board">BAR/Board Exam Review</option>
              </select>
            </View>
          )}

          {leaveType === "Special Leave Benefits for Women" && (
            <View style={styles.row}>
              <label style={webStyles.label}>Specify Illness</label>
              <TextInput
                style={styles.input}
                placeholder="Enter illness"
                value={womenIllness}
                onChangeText={setWomenIllness}
              />
            </View>
          )}

          {leaveType === "Others" && (
            <>
              <View style={styles.row}>
                <label style={webStyles.label}>Others Type</label>
                <select
                  value={othersType}
                  onChange={(e) => setOthersType(e.target.value)}
                  style={webStyles.select}
                >
                  <option value="">Select Type</option>
                  <option value="monetization">Monetization of Leave Credits</option>
                  <option value="terminal">Terminal Leave</option>
                </select>
              </View>

              <View style={styles.row}>
                <label style={webStyles.label}>Specify Reason</label>
                <TextInput
                  style={styles.input}
                  placeholder="Enter reason"
                  value={otherReason}
                  onChangeText={setOthersReason}
                />
              </View>
            </>
          )}

          {/* Dates */}
          <View style={styles.row}>
            <label style={webStyles.label}>Start Date *</label>
            <DateInput value={startDate} onChange={setStartDate} name="start" />
          </View>

          <View style={styles.row}>
            <label style={webStyles.label}>End Date *</label>
            <DateInput value={endDate} onChange={setEndDate} name="end" />
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              style={({ hovered, pressed }) => [
                styles.button,
                submitting && styles.buttonDisabled,
                hovered && !submitting && styles.buttonHover,
                pressed && { transform: [{ scale: 0.995 }] },
              ]}
            >
              <Text style={styles.buttonText}>
                {submitting ? "Submitting..." : "Submit Leave"}
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/(tabs)/teacher/my-leaves")} style={({ hovered }) => [styles.secondary, hovered && styles.secondaryHover]}>
              <Text style={styles.secondaryText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 28,
    backgroundColor: "#f5f7fb",
  },
  shell: {
    width: "100%",
    maxWidth: 1200,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(10,20,30,0.06)",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    marginBottom: 12,
    width: "100%",
  },
  input: {
    height: 46,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  actions: {
    marginTop: 14,
    flexDirection: "row",
    gap: 12,
  },
  button: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  buttonHover: {
    backgroundColor: "#13823d",
  },
  buttonDisabled: {
    backgroundColor: "#9e9e9e",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondary: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  secondaryHover: {
    backgroundColor: "#eaedf0",
  },

  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});


const webStyles = {
  label: { display: "block", marginBottom: 6, fontWeight: 600, color: "#374151" },
  select: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", marginBottom: 12, fontSize: 15 },
  htmlDate: { padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 15, width: "100%" },
};
