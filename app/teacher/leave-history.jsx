// app/teacher/leave-history.jsx
import { View, FlatList, Text } from "react-native";
import { mockLeaves } from "../../constants/mockLeaves";
import LeaveCard from "../../components/LeaveCard";

const LeaveHistory = () => {
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-xl font-bold mb-4">Leave History</Text>

      <FlatList
        data={mockLeaves}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LeaveCard leave={item} />}
      />
    </View>
  );
};

export default LeaveHistory;
