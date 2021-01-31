import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// import AppNavigationBar from "./navigations/AppNavigationBar";

// Imports
import HomeScreen from "./screens/HomeScreen";
import AppBottomNavigation from "./navigations/AppBottomNavigation";
import LoadingScreen from "./screens/LoadingScreen";
const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      {/* <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ header: (props) => <AppNavigationBar {...props} /> }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer> */}
      {/* <LoadingScreen /> */}
      <AppBottomNavigation />
    </>
  );
}
