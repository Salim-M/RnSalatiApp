import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, withTheme } from "react-native-paper";

const LoadingScreen = ({ theme }) => {
  const { colors } = theme;
  return (
    <View style={[styles.view, { backgroundColor: colors.background }]}>
      <ActivityIndicator animating={true} />
    </View>
  );
};
const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default withTheme(LoadingScreen);
