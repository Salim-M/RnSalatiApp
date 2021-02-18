import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";

import { List, FAB, Divider, withTheme } from "react-native-paper";
import { Audio } from "expo-av";

import LoadingScreen from "../LoadingScreen";

import SalatiApi from "../../apis/SalatiApi";

import {
  useFonts,
  Amiri_400Regular,
  Amiri_700Bold,
} from "@expo-google-fonts/amiri";

const Tafseer = ({ route, theme }) => {
  const { colors } = theme;
  const [tafseer, setTafseer] = useState({});
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);
  const [playing, setPlaying] = useState(false);

  const { ayah, surah, audioUrl } = route.params;

  let [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
  });

  const initAudio = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    sound.setOnPlaybackStatusUpdate(handleAudioUpdate);
    setSound(sound);
  };

  const handleAudioUpdate = async (AVPlaybackStatus) => {
    const { didJustFinish } = AVPlaybackStatus;
    if (didJustFinish) {
      setPlaying(false);
    }
  };

  const playAyah = async () => {
    const {
      positionMillis,
      isPlaying,
      playableDurationMillis,
    } = await sound.getStatusAsync();

    if (isPlaying) {
      setPlaying(false);
      // pause
      await sound.pauseAsync();
    } else if (!isPlaying && positionMillis === playableDurationMillis) {
      //ended
      setPlaying(true);
      await sound.replayAsync();
    } else {
      setPlaying(true);
      await sound.playAsync();
    }
  };

  const fetchTafseer = async (surah, ayah) => {
    try {
      const response = await SalatiApi.get("/tafseer", {
        params: {
          surah,
          ayah,
        },
      });
      setTafseer(response.data);
      setLoading(false);
    } catch (e) {}
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    initAudio();
    fetchTafseer(surah, ayah);
  }, []);

  if (!fontsLoaded) return <LoadingScreen />;

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
      }}
    >
      <FAB
        style={[styles.fab, { backgroundColor: colors.accent }]}
        icon={playing ? "pause" : "play"}
        animated
        color={colors.primary}
        onPress={playAyah}
      />
      {loading ? (
        <LoadingScreen />
      ) : (
        <FlatList
          data={tafseer.results}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={Divider}
          renderItem={({ item }) => (
            <List.Item
              title={item.type}
              description={item.body}
              descriptionNumberOfLines={100}
              descriptionStyle={styles.description}
              titleStyle={styles.title}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "right",
    fontFamily: "Amiri_700Bold",
    fontSize: 20,
  },
  description: {
    textAlign: "right",
    fontFamily: "Amiri_400Regular",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});

export default withTheme(Tafseer);
