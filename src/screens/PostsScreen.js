import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AppNavigationBar from "../navigations/AppNavigationBar";

import PostsScreenHome from "./PostsScreen/Home";
import PostsScreenDetail from "./PostsScreen/Detail";

export default () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PostsScreenHome"
        screenOptions={{ header: (props) => <AppNavigationBar {...props} /> }}
      >
        <Stack.Screen
          name="PostsScreenHome"
          component={PostsScreenHome}
          options={{ title: "Posts" }}
        />
        <Stack.Screen
          name="PostsScreenDetail"
          component={PostsScreenDetail}
          options={{ title: "" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
