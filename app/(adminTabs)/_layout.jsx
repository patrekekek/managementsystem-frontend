import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, TouchableOpacity } from "react-native";

export default function AdminTabsLayout() {
  const router = useRouter();


  const BackButton = () => (
    <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: Platform.OS === "ios" ? 10 : 6,
          height: 60,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
        headerLeft: () => <BackButton />,
      }}
    >

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer-outline" color={color} size={size} />
          ),
        }}
      />


      <Tabs.Screen
        name="leaveDetails"
        options={{
          title: "Leave Details",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" color={color} size={size} />
          ),
        }}
      />


      <Tabs.Screen
        name="manageTeachers"
        options={{
          title: "Teachers",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />


      {/* <Tabs.Screen
        name="report"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" color={color} size={size} />
          ),
        }}
      /> */}


      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="[id]"
        options={{
          href: null,
          title: "Leave Details",
        }}
      />

    </Tabs>
  );
}
