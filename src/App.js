import "react-native-gesture-handler";
import React, { useEffect } from "react";

import AppBottomNavigation from "./navigations/AppBottomNavigation";
import LoadingScreen from "./screens/LoadingScreen";

export default function App() {
  return (
    <>
      <AppBottomNavigation />
    </>
  );
}
