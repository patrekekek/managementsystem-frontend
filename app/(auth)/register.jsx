import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";

import { useRegister } from "../../hooks/useRegister";


export default function RegisterPage() {
  const { register, isLoading, error } = useRegister();
  const [name, setName] = useState({ first: "", middle: "", last: "" });
  const [username, setUsername] = useState("");
  const [office, setOffice] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const data = await register({
      name: {
        first: (name.first || "").trim(),
        middle: (name.middle || "").trim(),
        last: (name.last || "").trim(),
      },
      username: (username || "").trim(),
      office_department: (office || "").trim(),
      position: (position || "").trim(),
      salary: Number(salary),
      email: (email || "").trim(),
      password,
      role: "teacher",
    });

    if (data) {
      alert("Registration successful");
      router.replace("../(tabs)/teacher/dashboard");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Register an Account 📝</Text>
        <Text style={styles.subtitle}>
          Fill in the details to create your account
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* First Name */}
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={name.first}
          onChangeText={(text) => setName({ ...name, first: text })}
        />

        {/* Middle Name */}
        <TextInput
          style={styles.input}
          placeholder="Middle Name"
          value={name.middle}
          onChangeText={(text) => setName({ ...name, middle: text })}
        />

        {/* Last Name */}
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={name.last}
          onChangeText={(text) => setName({ ...name, last: text })}
        />

        {/* Username */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        {/* Office/Department */}
        <TextInput
          style={styles.input}
          placeholder="Office/Department"
          value={office}
          onChangeText={setOffice}
        />

        {/* Position */}
        <TextInput
          style={styles.input}
          placeholder="Position"
          value={position}
          onChangeText={setPosition}
        />

        {/* Salary */}
        <TextInput
          style={styles.input}
          placeholder="Salary"
          value={salary}
          onChangeText={setSalary}
          keyboardType="numeric"
        />

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Confirm Password */}
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>


        {/* Back to Login */}
        <TouchableOpacity onPress={() => router.replace("/auth/login")}>
          <Text style={styles.link}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    color: "#6b7280",
  },
  input: {
    height: 50,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#2563eb",
    fontSize: 14,
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
});
