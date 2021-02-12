import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AppNavigationBar from "../navigations/AppNavigationBar";

// Screens
import QiblaScreenHome from "./QiblaScreen/Home";

export default () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="QiblaScreenHome" headerMode="none">
        <Stack.Screen name="QiblaScreenHome" component={QiblaScreenHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
