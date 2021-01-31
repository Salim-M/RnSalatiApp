import * as React from "react";
import { AppRegistry } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { name as appName } from "./app.json";
import App from "./src/App";

const theme = {
  ...DefaultTheme,
  colors: {
    primary: "#1b5e20",
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
