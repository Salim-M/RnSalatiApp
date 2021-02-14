import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AppNavigationBar from "../navigations/AppNavigationBar";

import CalendarScreenHome from "./CalendarScreen/Home";

export default () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CalendarScreenHome"
        screenOptions={{ header: (props) => <AppNavigationBar {...props} /> }}
      >
        <Stack.Screen
          name="CalendarScreenHome"
          component={CalendarScreenHome}
          options={{ title: "Calendar" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
