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
  useWindowDimensions,
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
  const { width } = useWindowDimensions();

  const isNarrowWeb = Platform.OS === "web" && width < 900;

  useEffect(() => {
    const load = async () => {
      const source = user
        ? user
        : JSON.parse((await AsyncStorage.getItem("user")) || "null");

      if (!source) return;
      setProfilePicture(source.profilePicture || "");
      setBio(source.bio || "");
      setFeeling(source.feeling || "");
    };
    load();
  }, [user]);

  const updateLocalUser = async (patch) => {
    const stored = await AsyncStorage.getItem("user");
    if (!stored) return;
    await AsyncStorage.setItem(
      "user",
      JSON.stringify({ ...JSON.parse(stored), ...patch })
    );
  };

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const stored = await AsyncStorage.getItem("user");
      if (!stored) throw new Error("No user");
      const { token } = JSON.parse(stored);

      const body = new FormData();
      body.append("image", file);

      const res = await fetch(`${API_URL}/users/upload-profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const url = data.url || data.profilePicture;
      setProfilePicture(url);
      await updateLocalUser({ profilePicture: url });
      Alert.alert("Success", "Profile photo updated!");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setUploading(false);
    }
  };

  const pickImageNative = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) return;
    const img = result.assets[0];
    const blob = await (await fetch(img.uri)).blob();
    uploadImage(new File([blob], "profile.jpg", { type: blob.type }));
  };

  const onAvatarPress = () => {
    if (Platform.OS === "web") return fileInputRef.current?.click();
    pickImageNative();
  };

  const saveProfile = async () => {
    if (!bio.trim() && !feeling.trim()) return;

    setSaving(true);
    try {
      const stored = await AsyncStorage.getItem("user");
      const { token } = JSON.parse(stored);

      const res = await fetch(`${API_URL}/users/update-bio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio, feeling }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await updateLocalUser({
        bio: data.user.bio,
        feeling: data.user.feeling,
      });
      Alert.alert("Saved", "Profile updated");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setSaving(false);
    }
  };

  const displayName = `${user?.name?.first || ""} ${
    user?.name?.middle ? user.name.middle[0] + "." : ""
  } ${user?.name?.last || ""}`.trim();

  return (
    <View
      style={[
        styles.root,
        Platform.OS === "web" && !isNarrowWeb && styles.rootWeb,
      ]}
    >
      {Platform.OS === "web" && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => uploadImage(e.target.files[0])}
        />
      )}

      {/* AVATAR */}
      <View style={styles.avatarColumn}>
        <TouchableOpacity onPress={onAvatarPress} disabled={uploading}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {(user?.name?.first || "U")[0]}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.name}>{displayName}</Text>
        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* FORM */}
      <View style={styles.formColumn}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={bio}
          onChangeText={setBio}
        />

        <Text style={styles.label}>Feeling</Text>
        <TextInput
          style={styles.input}
          value={feeling}
          onChangeText={setFeeling}
        />

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primary}
            onPress={saveProfile}
            disabled={saving || uploading}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>Save</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondary}
            onPress={() => {
              setBio(user?.bio || "");
              setFeeling(user?.feeling || "");
            }}
          >
            <Text>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const AVATAR = 110;

const styles = StyleSheet.create({
  root: { gap: 16 },
  rootWeb: { flexDirection: "row", alignItems: "flex-start" },

  avatarColumn: {
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },

  formColumn: {
    flex: 1,
    width: "100%",
  },

  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: 14,
  },

  avatarPlaceholder: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: 14,
    backgroundColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarInitial: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },

  name: { fontWeight: "700", marginTop: 8 },

  label: { marginBottom: 6, fontWeight: "600" },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  textArea: { height: 110 },

  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  primary: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 10,
  },

  primaryText: { color: "#fff", fontWeight: "700" },

  secondary: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
  },

  logout: {
    marginTop: 12,
    backgroundColor: "#D1FFBD",
    padding: 10,
    borderRadius: 8,
  },

  logoutText: { fontWeight: "700", color: "#064E3B" },
});
