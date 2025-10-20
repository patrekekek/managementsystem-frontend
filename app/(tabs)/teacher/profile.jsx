import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../config";

import { useAuthContext } from "../../../hooks/useAuthContext";

export default function Profile() {
  const { user } = useAuthContext();
  const [bio, setBio] = useState("");
  const [feeling, setFeeling] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const { profilePicture } = JSON.parse(storedUser);
          if (profilePicture) setProfilePicture(profilePicture);
          if (userData.bio) setBio(userData.bio);
          if (userData.feeling) setFeeling(userData.feeling);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    loadProfile();
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ fixed
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) return;

    try {

      setUploading(true);

      const image = result.assets[0];
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return Alert.alert("Error", "No user found.");

      const { token } = JSON.parse(storedUser);

      const formData = new FormData();
      formData.append("image", {
        uri: image.uri,
        type: "image/jpeg",
        name: "profile.jpg",
      });

      const res = await fetch(`${API_URL}/users/upload-profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setProfilePicture(data.url);
        const updatedUser = { ...JSON.parse(storedUser), profilePicture: data.url };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

        Alert.alert("Success", "Profile photo updated!");
      } else {
        Alert.alert("Upload failed", data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error", "Could not upload image.");
    } finally {
      setUploading(false);
    }
  };


  const handlePostBio = async () => {
     try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return Alert.alert("Error", "No user found.");

      const { token } = JSON.parse(storedUser);

      const res = await fetch(`${API_URL}/users/update-bio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio, feeling }),
      });

      const data = await res.json();

      if (res.ok) {

        const updatedUser = { ...JSON.parse(storedUser), bio: data.user.bio, feeling: data.user.feeling };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

        Alert.alert("Success", "Your profile has been updated!");
      } else {
        Alert.alert("Error", data.error || "Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
      Alert.alert("Error", "Could not update profile.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 My Profile</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {uploading ? (
          <ActivityIndicator size="large" color="#4CAF50" />  // ✅ spinner while uploading
        ) : profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={{ width: 110, height: 110, borderRadius: 12 }}
          />
        ) : (
          <View style={styles.avatarBox}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Full Name</Text>
      <Text style={styles.readonlyInput}>{user?.name.first} {user?.name.middle ? user?.name.middle.charAt(0).toUpperCase() + "." : ""} {user?.name.last}</Text>

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

      <TouchableOpacity style={styles.button} onPress={handlePostBio}>
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
    backgroundColor: "#4CAF50",
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
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
