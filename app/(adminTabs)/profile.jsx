// app/(tabs)/teacher/profile.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function Profile() {
  const [name] = useState("Juan Dela Cruz"); 
  const [bio, setBio] = useState("");
  const [feeling, setFeeling] = useState("");

  const handleSave = () => {

    alert("Profile updated (local only).");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 My Profile</Text>


      <TouchableOpacity style={styles.imageContainer}>
        <View style={styles.avatarBox}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Photo</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.label}>Full Name</Text>
      <Text style={styles.readonlyInput}>{name}</Text>

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={bio}
        onChangeText={setBio}
        placeholder="Tell something about yourself..."
        multiline
      />

      <Text style={styles.label}>How are you feeling today?</Text>
      <TextInput
        style={styles.input}
        value={feeling}
        onChangeText={setFeeling}
        placeholder="😊 Happy, 😓 Tired, 😍 Inspired..."
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: { alignItems: "center", marginBottom: 20 },
  avatarBox: {
    width: 110,
    height: 110,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
    color: "#555",
  },
  readonlyInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#eee",
    color: "#666",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "lightblue",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
