// components/LeaveCard.jsx
import { View, Text } from "react-native";

const statusColors = {
  Approved: "text-green-500",
  Pending: "text-yellow-500",
  Rejected: "text-red-500",
};

const LeaveCard = ({ leave }) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow">
      <Text className="text-lg font-bold">{leave.type}</Text>
      <Text className="text-gray-600">{leave.teacherName}</Text>
      <Text className="text-gray-500">
        {leave.startDate} → {leave.endDate}
      </Text>
      <Text className={`mt-2 font-semibold ${statusColors[leave.status]}`}>
        {leave.status}
      </Text>
    </View>
  );
};

export default LeaveCard;
