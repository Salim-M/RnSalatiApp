import "react-native-gesture-handler";
import React from "react";
import * as Sentry from "sentry-expo";

import AppBottomNavigation from "./navigations/AppBottomNavigation";

Sentry.init({
  dsn:
    "https://fde80fefbfe54947bd1cf7ff998d7b13@o376634.ingest.sentry.io/5636422",
  enableInExpoDevelopment: true,
  debug: true,
});

export default function App() {
  return (
    <>
      <AppBottomNavigation />
    </>
  );
}
