import React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";
import QuranScreen from "../screens/QuranScreen";

export default () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Home", icon: "home" },
    { key: "quran", title: "Quran", icon: "book" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    quran: QuranScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};
