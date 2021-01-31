import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//
import AppNavigationBar from "../navigations/AppNavigationBar";

// Screens
import QuranScreenHome from "./QuranScreen/Home";
import QuranScreenDetail from "./QuranScreen/Detail";

export default () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="QuranScreenHome"
        screenOptions={{ header: (props) => <AppNavigationBar {...props} /> }}
      >
        <Stack.Screen
          name="QuranScreenHome"
          component={QuranScreenHome}
          options={{ title: "Quran" }}
        />
        <Stack.Screen
          name="QuranScreenDetail"
          component={QuranScreenDetail}
          options={({ route }) => ({ title: route.params.englishName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
