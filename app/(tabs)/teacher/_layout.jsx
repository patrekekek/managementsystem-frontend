// fallback layout that delegates to platform-specific layouts
import { Platform } from "react-native";

let Layout;
if (Platform.OS === "web") {
  Layout = require("./_layout.web").default;
} else {
  Layout = require("./_layout.native").default;
}

export default Layout;
