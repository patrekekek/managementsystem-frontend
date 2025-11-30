import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";
import { useLogout } from "../hooks/useLogout";


export default function ProfileFormWeb({ user }) {
  const [bio, setBio] = useState("");
  const [feeling, setFeeling] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const { logout } = useLogout();


  useEffect(() => {
    const load = async () => {
      if (user) {
        setProfilePicture(user.profilePicture || "");
        setBio(user.bio || "");
        setFeeling(user.feeling || "");
      } else {
        try {
          const stored = await AsyncStorage.getItem("user");
          if (stored) {
            const u = JSON.parse(stored);
            setProfilePicture(u.profilePicture || "");
            setBio(u.bio || "");
            setFeeling(u.feeling || "");
          }
        } catch (err) {
          console.warn("Profile load error", err);
        }
      }
    };
    load();
  }, [user]);


  const updateLocalUser = async (patch) => {
    try {
      const stored = await AsyncStorage.getItem("user");
      if (!stored) return;
      const u = JSON.parse(stored);
      const merged = { ...u, ...patch };
      await AsyncStorage.setItem("user", JSON.stringify(merged));
    } catch (err) {
      console.warn("Failed to update local user cache", err);
    }
  };

  const handleFileFromInput = async (file) => {
    if (!file) return;
    await uploadImage(file);
  };

  const pickImageNative = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Please allow photo access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled) return;
      const image = result.assets[0];
      const blob = await (await fetch(image.uri)).blob();
      const file = new File([blob], "profile.jpg", { type: blob.type || "image/jpeg" });
      await uploadImage(file, image.uri);
    } catch (err) {
      console.error("Image pick error", err);
      Alert.alert("Error", "Cannot pick image.");
    }
  };


  const uploadImage = async (file, previewUri) => {
    setUploading(true);
    try {
      const stored = await AsyncStorage.getItem("user");
      if (!stored) {
        throw new Error("User not found in local storage");
      }
      const { token } = JSON.parse(stored);

      const body = new FormData();

      body.append("image", file);

      const res = await fetch(`${API_URL}/users/upload-profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const newUrl = data.url || data.profilePicture || data.data?.url;
      setProfilePicture(newUrl);
      await updateLocalUser({ profilePicture: newUrl });

      Alert.alert("Success", "Profile photo updated!");
    } catch (err) {
      console.error("Upload error", err);
      Alert.alert("Upload failed", err.message || "Please try again");
    } finally {
      setUploading(false);
    }
  };

  const onAvatarPress = () => {
    if (Platform.OS === "web") {
      if (fileInputRef.current) fileInputRef.current.click();
      return;
    }
    pickImageNative();
  };


  const handlePostBio = async () => {
    if (bio.trim().length === 0 && feeling.trim().length === 0) {
      Alert.alert("Nothing to save", "Please add a bio or how you're feeling.");
      return;
    }

    setSaving(true);
    try {
      const stored = await AsyncStorage.getItem("user");
      if (!stored) {
        throw new Error("User not found");
      }
      const { token } = JSON.parse(stored);

      const res = await fetch(`${API_URL}/users/update-bio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: bio.trim(), feeling: feeling.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      await updateLocalUser({ bio: data.user.bio, feeling: data.user.feeling });
      Alert.alert("Success", "Your profile has been updated!");
    } catch (err) {
      console.error("Update error", err);
      Alert.alert("Error", err.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };


  const displayName = `${user?.name?.first || ""} ${user?.name?.middle ? user?.name?.middle.charAt(0).toUpperCase() + "." : ""} ${user?.name?.last || ""}`.trim();
  const displaySalary = user?.salary ? `P ${Number(user.salary).toLocaleString()}` : "-";

  return (
    <View style={[styles.root, Platform.OS === "web" ? styles.rootWeb : null]}>
      {Platform.OS === "web" && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) await handleFileFromInput(f);
            e.target.value = null;
          }}
        />
      )}

      <View style={styles.avatarColumn}>
        <TouchableOpacity onPress={onAvatarPress} style={styles.imageContainer} disabled={uploading}>
          {uploading ? (
            <View style={[styles.avatarBox, styles.avatarUploading]}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarBox}>
              <Text style={styles.avatarInitials}>{(user?.name?.first || "U").charAt(0).toUpperCase()}</Text>
            </View>
          )}

          <View style={styles.editBadge}>
            <Text style={styles.editBadgeText}>Edit</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.labelSmall}>{displayName}</Text>
        <Text style={styles.muted}>{displaySalary}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formColumn}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
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

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.button, (saving || uploading) && styles.buttonDisabled]}
            onPress={handlePostBio}
            disabled={saving || uploading}
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondary, (saving || uploading) && styles.disabledSecondary]}
            onPress={() => {
              setBio(user?.bio || "");
              setFeeling(user?.feeling || "");
            }}
            disabled={saving || uploading}
          >
            <Text style={styles.secondaryText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const AVATAR_SIZE = 110;
const styles = StyleSheet.create({
  root: {
    flexDirection: "column",
    gap: 12,
  },

  rootWeb: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  avatarColumn: {
    width: Platform.OS === "web" ? 300 : "100%",
    alignItems: "center",
    paddingRight: Platform.OS === "web" ? 24 : 0,
  },
  formColumn: {
    flex: 1,
    minWidth: 280,
  },

  imageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatarBox: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 14,
    backgroundColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarUploading: {
    opacity: 0.85,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 14,
    resizeMode: "cover",
  },
  avatarInitials: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },

  editBadge: {
    position: "absolute",
    right: -6,
    bottom: -6,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#e6e9ef",
  },
  editBadgeText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 12,
  },

  labelSmall: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 6,
  },
  muted: {
    color: "#6b7280",
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 110,
    textAlignVertical: "top",
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  button: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginRight: 12,
  },
  buttonDisabled: { opacity: 0.6 },

  buttonText: { color: "#fff", fontWeight: "700" },

  secondary: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  disabledSecondary: { opacity: 0.6 },
  secondaryText: { color: "#374151", fontWeight: "700" },

  logoutButton: {
    marginTop: 14,
    backgroundColor: "#D1FFBD",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  logoutText: {
    color: "#064E3B",
    fontWeight: "700",
  },
});
