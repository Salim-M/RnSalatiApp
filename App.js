import * as React from "react";
import { AppRegistry } from "react-native";
import { Provider as PaperProvider, DarkTheme } from "react-native-paper";
import { name as appName } from "./app.json";
import App from "./src/App";

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#fff",
    accent: "#212121",
    notification: "#4caf50",
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
AppRegistry.registerHeadlessTask("SomeTaskName", () =>
  require("./src/tasks/pushPrayers")
);
