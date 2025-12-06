import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";


export default function AdminTabsWebLayout() {
  return (
    <View style={styles.page}>
      <Stack screenOptions={{ headerShown: false }}/>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
});
