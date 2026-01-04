import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useResponsive } from "../hooks/useResponsive";

export default function WebPage({ children }) {
  const { isMobile } = useResponsive();

  return (
    <ScrollView
      showsVerticalScrollIndicator
      contentContainerStyle={styles.page}
    >
      <View
        style={[
          styles.shell,
          isMobile && styles.shellMobile,
        ]}
      >
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: "#f5f7fb",
    paddingVertical: 24,
    paddingBottom: 40,
  },

  shell: {
    width: "100%",
    maxWidth: 1200,
    marginHorizontal: "auto",
    paddingHorizontal: 20,
  },

  shellMobile: {
    paddingHorizontal: 14,
  },
});
