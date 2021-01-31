import React from "react";
import { Surface, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";

export default function SalatWidget() {
  return (
    <View>
      <Surface style={styles.surface}>
        <Text>Salat Widget....</Text>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    elevation: 1,
  },
});
