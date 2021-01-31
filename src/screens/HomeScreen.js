import React from "react";
import { ScrollView } from "react-native";

import { Surface, Text } from "react-native-paper";

import SalatWidget from "../widgets/SalatWidget";
export default function HomeScreen() {
  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <SalatWidget />
    </ScrollView>
  );
}
