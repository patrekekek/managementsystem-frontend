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
import { useResponsive } from "../../../hooks/useResponsive";

import { leaveList, leaveTypeEnumMap } from "../../../constants/leaveList";
import TeacherWebTabs from "../../../components/TeacherWebTabs";

export default function FileLeaveWeb() {
  const { user } = useAuthContext();
  const { fileLeave } = useFileLeave();
  const { isMobile } = useResponsive();
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
          ? {
              mastersDegree: studyType === "masters",
              boardExamReview: studyType === "board",
            }
          : {},
      specialWomen:
        mappedLeaveType === "special-women"
          ? { illness: womenIllness }
          : {},
      mandatoryForcedLeave:
        mappedLeaveType === "mandatory-forced" ? {} : {},
      others:
        mappedLeaveType === "others"
          ? {
              monetization: othersType === "monetization",
              terminal: othersType === "terminal",
              reason: otherReason,
            }
          : {},
    };

    try {
      setSubmitting(true);
      await fileLeave(leaveData);
      window.alert("Leave filed successfully!");
      router.push("/(tabs)/teacher/my-leaves");
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

  const DateInput = ({ value, onChange }) => {
    if (Platform.OS === "web") {
      return (
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={webStyles.htmlDate}
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

        <View style={[styles.card, isMobile && styles.cardMobile]}>
          <Text style={styles.heading}>File a Leave</Text>

          {/* Leave Type */}
          <View style={styles.row}>
            <label style={webStyles.label}>Leave Type *</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              style={webStyles.select}
            >
              <option value="">Select leave type</option>
              {leaveList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </View>

          {/* Conditional Fields */}
          {leaveType === "Vacation Leave" && (
            <>
              <Input label="Vacation Within Philippines" value={vacationWithin} onChange={setVacationWithin} />
              <Input label="Vacation Abroad" value={vacationAbroad} onChange={setVacationAbroad} />
            </>
          )}

          {leaveType === "Sick Leave" && (
            <>
              <Select
                label="Sick Type"
                value={sickType}
                onChange={setSickType}
                options={[
                  { value: "hospital", label: "In Hospital" },
                  { value: "outpatient", label: "Out Patient" },
                ]}
              />
              <Input label="Specify Illness" value={sickIllness} onChange={setSickIllness} />
            </>
          )}

          {leaveType === "Study Leave" && (
            <Select
              label="Study Type"
              value={studyType}
              onChange={setStudyType}
              options={[
                { value: "masters", label: "Completion of Master's Degree" },
                { value: "board", label: "BAR / Board Exam Review" },
              ]}
            />
          )}

          {leaveType === "Special Leave Benefits for Women" && (
            <Input label="Specify Illness" value={womenIllness} onChange={setWomenIllness} />
          )}

          {leaveType === "Others" && (
            <>
              <Select
                label="Others Type"
                value={othersType}
                onChange={setOthersType}
                options={[
                  { value: "monetization", label: "Monetization of Leave Credits" },
                  { value: "terminal", label: "Terminal Leave" },
                ]}
              />
              <Input label="Specify Reason" value={otherReason} onChange={setOthersReason} />
            </>
          )}

          <View style={styles.row}>
            <label style={webStyles.label}>Start Date *</label>
            <DateInput value={startDate} onChange={setStartDate} />
          </View>

          <View style={styles.row}>
            <label style={webStyles.label}>End Date *</label>
            <DateInput value={endDate} onChange={setEndDate} />
          </View>

          <View style={[styles.actions, isMobile && styles.actionsMobile]}>
            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              style={({ hovered }) => [
                styles.button,
                hovered && styles.buttonHover,
                submitting && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.buttonText}>
                {submitting ? "Submitting…" : "Submit Leave"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(tabs)/teacher/my-leaves")}
              style={({ hovered }) => [
                styles.secondary,
                hovered && styles.secondaryHover,
              ]}
            >
              <Text>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}


function Input({ label, value, onChange }) {
  return (
    <View style={styles.row}>
      <label style={webStyles.label}>{label}</label>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <View style={styles.row}>
      <label style={webStyles.label}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={webStyles.select}
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </View>
  );
}


const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: "#f5f7fb",
    alignItems: "center",
    paddingVertical: 28,
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
  },
  cardMobile: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    marginBottom: 12,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  actionsMobile: {
    flexDirection: "column",
  },
  button: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
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
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  secondaryHover: {
    backgroundColor: "#eaedf0",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const webStyles = {
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: 600,
    color: "#374151",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 15,
  },
  htmlDate: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 15,
  },
};
