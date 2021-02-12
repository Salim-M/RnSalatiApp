import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Vibration } from "react-native";
import { Divider, List, withTheme } from "react-native-paper";

import {
  useFonts,
  Amiri_400Regular,
  Amiri_700Bold,
} from "@expo-google-fonts/amiri";

import QuranApi from "../../apis/QuranApi";
import LoadingScreen from "../LoadingScreen";

import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("appstorage.db");

const Detail = ({ route, theme, navigation }) => {
  const { number } = route.params;
  const { colors } = theme;

  const [loading, setLoading] = useState(true);
  const [ayahs, setAyahs] = useState([]);
  const [reachedAyah, setReachedAyah] = useState(-1);

  const putDb = async () => {
    try {
      const response = await QuranApi.get(`/surah/${number}/ar.alafasy`);

      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO surahs (surahNumber, surahContent, reachedAyah) VALUES (?, ?, ?);`,
          [number, JSON.stringify(response.data.data.ayahs), -1],
          () => {
            // setState after being saved in cache db
            setAyahs(response.data.data.ayahs);
            setLoading(false);
          }
        );
      });
    } catch (e) {}
  };

  const fetchSurah = () => {
    db.transaction((tx) => {
      try {
        tx.executeSql(
          `SELECT * FROM surahs WHERE surahNumber = ?;`,
          [number],
          (tx, res) => {
            if (res.rows.length === 0) {
              putDb();
            } else {
              const surah = JSON.parse(res.rows?._array[0].surahContent);
              res.rows?._array[0].reachedAyah !== -1
                ? setReachedAyah(res.rows?._array[0].reachedAyah)
                : null;
              setAyahs(surah);
              setLoading(false);
            }
          }
        );
      } catch (e) {}
    });
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists surahs (id integer primary key not null, surahNumber int, surahContent text, reachedAyah int);",
        [],
        fetchSurah
      );
    });
  }, []);

  let [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
  });

  if (loading || !fontsLoaded) return <LoadingScreen />;
  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <FlatList
        data={ayahs}
        keyExtractor={(item) => item.number.toString()}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
          <List.Item
            title={item.text}
            descriptionNumberOfLines={1}
            titleNumberOfLines={100}
            titleStyle={styles.text}
            description={`آية ${item.numberInSurah} · صفحة ${item.page}`}
            left={() => {
              if (item.numberInSurah === reachedAyah) {
                return (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#4caf50",
                    }}
                  />
                );
              }

              return;
            }}
            onPress={() =>
              navigation.navigate("QuranScreenTafseer", {
                surah: number,
                ayah: item.number,
                audioUrl: item.audio,
              })
            }
            onLongPress={() => {
              Vibration.vibrate(55);
              db.transaction((tx) => {
                tx.executeSql(
                  `UPDATE surahs SET reachedAyah = ? WHERE surahNumber = ?;`,
                  [item.numberInSurah, number],
                  () => {
                    setReachedAyah(item.numberInSurah);
                    Vibration.vibrate(55);
                  }
                );
              });
            }}
          />
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    textAlign: "right",
    fontSize: 20,
    fontFamily: "Amiri_700Bold",
  },
  modal: {
    backgroundColor: "#fff",
    textAlign: "right",
    padding: 16,
    borderRadius: 5,
  },
  actionText: {
    color: "#fff",
    paddingHorizontal: 20,
    fontSize: 25,
    fontFamily: "Amiri_400Regular",
  },
});

export default withTheme(Detail);
