import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function LoadingScreen() {
  return (
    <View style={styles.view}>
      <ActivityIndicator animating={true} />
    </View>
  );
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
