import React, { useEffect, useState } from "react";

import { View, FlatList, StyleSheet } from "react-native";
import { List, withTheme, Divider, Searchbar } from "react-native-paper";

import {
  useFonts,
  Amiri_400Regular,
  Amiri_700Bold,
} from "@expo-google-fonts/amiri";

import LoadingScreen from "../LoadingScreen";

const Home = ({ navigation, theme }) => {
  const { colors } = theme;

  const [surahs, setSurahs] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query) => {
    const surahs = require("../../surahs.json");
    setSurahs(
      surahs.filter((item) =>
        item.englishName.toLowerCase().includes(query.toLowerCase())
      )
    );
    setSearchQuery(query);
  };

  let [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
  });
  useEffect(() => {
    setSurahs(require("../../surahs.json"));
  }, []);

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
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <FlatList
        data={surahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        initialNumToRender={10}
        ListHeaderComponent={
          <>
            <Searchbar
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={searchQuery}
              style={{ margin: 10 }}
            />
          </>
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    textAlign: "right",
    fontFamily: "Amiri_700Bold",
    fontSize: 20,
    marginVertical: -4,
  },
  description: {
    textAlign: "right",
    fontFamily: "Amiri_400Regular",
  },
});

export default withTheme(Home);
