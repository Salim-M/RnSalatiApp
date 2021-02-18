import React from "react";
import { BottomNavigation } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";
import QuranScreen from "../screens/QuranScreen";
import CalendarScreen from "../screens/CalendarScreen";
import QiblaScreen from "../screens/QiblaScreen";
import PostsScreen from "../screens/PostsScreen";

export default () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Home", icon: "home" },
    {
      key: "posts",
      title: "Posts",
      icon: "newspaper",
      badge: true,
    },
    { key: "quran", title: "Quran", icon: "book" },
    { key: "calendar", title: "Calendar", icon: "calendar" },

    { key: "qibla", title: "Qibla", icon: "compass" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    quran: QuranScreen,
    calendar: CalendarScreen,
    posts: PostsScreen,
    qibla: QiblaScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};
