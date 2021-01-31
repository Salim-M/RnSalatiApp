import React from "react";

import { View, FlatList, StyleSheet } from "react-native";
import { List, Divider } from "react-native-paper";

import {
  useFonts,
  Amiri_400Regular,
  Amiri_700Bold,
} from "@expo-google-fonts/amiri";

import Surahs from "../../data/surahs";
import LoadingScreen from "../LoadingScreen";

export default Home = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
  });

  if (!fontsLoaded) return <LoadingScreen />;

  const renderItem = ({ item }) => (
    <List.Item
      title={item.name}
      onPress={() => navigation.navigate("QuranScreenDetail", item)}
      description={`${item.englishName} · ${item.englishNameTranslation}`}
      titleStyle={styles.title}
      descriptionStyle={styles.description}
    />
  );
  return (
    <View>
      <FlatList
        data={Surahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        initialNumToRender={10}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    textAlign: "right",
    fontFamily: "Amiri_700Bold",
    fontSize: 20,
    marginVertical: -5,
  },
  description: {
    textAlign: "right",
    fontFamily: "Amiri_400Regular",
  },
});
