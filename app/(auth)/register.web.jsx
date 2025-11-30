import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Image,
} from "react-native";
import { router } from "expo-router";

import { useRegister } from "../../hooks/useRegister";

export default function RegisterPage() {
  const { width } = useWindowDimensions();
  const isWide = width >= 960; // desktop breakpoint
  const cardMaxWidth = Math.min(1200, width * 0.92);

  const { register, isLoading, error } = useRegister();

  const [name, setName] = useState({ first: "", middle: "", last: "" });
  const [username, setUsername] = useState("");
  const [office, setOffice] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const validateRequired = () => {
    if (!name.first.trim() || !name.last.trim() || !username.trim() || !email.trim() || !password) {
      alert("Please complete the required fields (First name, Last name, Username, Email, Password).");
      return false;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateRequired()) return;

    const data = await register({
      name: {
        first: (name.first || "").trim(),
        middle: (name.middle || "").trim(),
        last: (name.last || "").trim(),
      },
      username: (username || "").trim(),
      office_department: (office || "").trim(),
      position: (position || "").trim(),
      salary: Number(salary) || 0,
      email: (email || "").trim(),
      password,
      role: "teacher",
    });

    if (data) {
      alert("Registration successful");
      router.replace("../(tabs)/teacher/dashboard");
    }
  };

  const third = { width: isWide ? "32%" : "100%" };
  const half = { width: isWide ? "48%" : "100%" };
  const full = { width: "100%" };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.outer, { backgroundColor: "#f3f6f9" }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, isWide && styles.titleWide]}>Register ta, cher</Text>
        <Text style={[styles.subtitle, isWide && styles.subtitleWide]}>
          Fill in the details to create your account
        </Text>

        <View style={[styles.card, { width: cardMaxWidth }]}>
          {/* Left illustration (desktop only) */}
          {isWide && (
            <View style={styles.leftPanel}>
              <Image
                source={require("../../assets/register-illustration.png")}
                style={styles.illustration}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
            </View>
          )}

          {/* Form grid */}
          <View style={styles.formPanel}>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.gridRow}>
              {/* First, Middle, Last */}
              <View style={[styles.formField, third]}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  value={name.first}
                  onChangeText={(t) => setName({ ...name, first: t })}
                />
              </View>

              <View style={[styles.formField, third]}>
                <Text style={styles.label}>Middle Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Middle Name"
                  value={name.middle}
                  onChangeText={(t) => setName({ ...name, middle: t })}
                />
              </View>

              <View style={[styles.formField, third]}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  value={name.last}
                  onChangeText={(t) => setName({ ...name, last: t })}
                />
              </View>
            </View>

            {/* Username under name row */}
            <View style={[styles.gridRow, { marginTop: 6 }]}>
              <View style={[styles.formField, full]}>
                <Text style={styles.label}>Username *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Office & Position */}
            <View style={styles.gridRow}>
              <View style={[styles.formField, half]}>
                <Text style={styles.label}>Office / Department</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Office / Department"
                  value={office}
                  onChangeText={setOffice}
                />
              </View>

              <View style={[styles.formField, half]}>
                <Text style={styles.label}>Position</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Position"
                  value={position}
                  onChangeText={setPosition}
                />
              </View>
            </View>

            {/* Salary & Email  */}
            <View style={styles.gridRow}>
              <View style={[styles.formField, half]}>
                <Text style={styles.label}>Salary</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Salary"
                  value={salary}
                  onChangeText={setSalary}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.formField, half]}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password pair */}
            <View style={styles.gridRow}>
              <View style={[styles.formField, half]}>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={[styles.formField, half]}>
                <Text style={styles.label}>Confirm Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Actions */}
            <View style={[styles.gridRow, { marginTop: 8 }]}>
              <Pressable
                onPress={handleRegister}
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.button,
                  isLoading && styles.buttonDisabled,
                  pressed && { transform: [{ scale: 0.995 }] },
                ]}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Registering..." : "Register"}
                </Text>
              </Pressable>
            </View>

            <View style={[styles.gridRow, { marginTop: 10 }]}>
              <Pressable onPress={() => router.replace("/(auth)/login")}>
                <Text style={styles.link}>Already have an account? Log In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 6,
  },
  titleWide: {
    fontSize: 34,
  },

  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 18,
  },
  subtitleWide: {
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 0,
    // shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    // elevation for Android
    elevation: 8,
    flexDirection: "row",
    overflow: "hidden",
  },

  leftPanel: {
    width: 300,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  illustration: {
    width: 240,
    height: 160,
  },

  formPanel: {
    flex: 1,
    padding: 20,
  },

  gridRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 6,
  },

  formField: {
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
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

  button: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    cursor: Platform.OS === "web" ? "pointer" : "auto",
  },
  buttonDisabled: {
    backgroundColor: "#9E9E9E",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  link: {
    color: "#2563eb",
    fontSize: 14,
    textDecorationLine: "underline",
    alignSelf: "center",
    cursor: Platform.OS === "web" ? "pointer" : "auto",
  },

  error: {
    color: "#b91c1c",
    marginBottom: 12,
    textAlign: "center",
  },
});
