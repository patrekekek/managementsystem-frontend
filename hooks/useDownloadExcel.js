import { useCallback } from "react";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { API_URL } from "../config";

export function useDownloadExcel() {
  const downloadExcel = useCallback(async (endpoint, fileName) => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const { token } = JSON.parse(userData);

      const downloadURL = `${API_URL}/${endpoint}`;

      // Browser
      if (Platform.OS === "web") {
        const response = await fetch(downloadURL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        return;
      }

      //ios mobile or android
      const fileUri = FileSystem.documentDirectory + `${fileName}.xlsx`;

      const response = await FileSystem.downloadAsync(downloadURL, fileUri, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("File downloaded to:", response.uri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(response.uri);
      } else {
        alert("Sharing not available on this device");
      }

    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download the Excel file.");
    }
  }, []);

  return { downloadExcel };
}
