import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Animated } from "react-native";
import {
  Divider,
  List,
  Portal,
  Modal,
  Text,
  ActivityIndicator,
  TouchableRipple,
  withTheme,
} from "react-native-paper";

import {
  useFonts,
  Amiri_400Regular,
  Amiri_700Bold,
} from "@expo-google-fonts/amiri";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import QuranApi from "../../apis/QuranApi";
import TafseerApi from "../../apis/TafseerApi";
import LoadingScreen from "../LoadingScreen";

const Detail = ({ route, theme }) => {
  const { colors } = theme;
  const { number } = route.params;

  const [loading, setLoading] = useState(true);
  const [ayahs, setAyahs] = useState([]);

  const [visible, setVisible] = React.useState(false);

  const [tafseerLoading, setTafseerLoading] = useState(true);
  const [tafseer, setTafseer] = useState({});

  // const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const fetchSurah = async () => {
    try {
      const response = await QuranApi.get(`/surah/${number}`);
      setAyahs(response.data.data.ayahs);
      setLoading(false);
    } catch (e) {}
  };

  useEffect(() => {
    fetchSurah();
  }, []);

  let [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
  });

  const fetchTafseer = async (surah, ayah) => {
    console.log("Tafseer");
    setVisible(true);
    setTafseerLoading(true);
    setTafseer({});
    try {
      const response = await TafseerApi.get("/tafseer", {
        params: {
          surah,
          ayah,
        },
      });
      setTafseer(response.data);
      // console.log(response.data.results);
      setTafseerLoading(false);
    } catch (e) {}
  };

  const RightActions = ({ surah, ayah }) => {
    return (
      <TouchableRipple onPress={() => fetchTafseer(surah, ayah)}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 12,
            backgroundColor: colors.primary,
          }}
        >
          <Text>
            <MaterialCommunityIcons name="help-circle" size={28} color="#fff" />
          </Text>
        </View>
      </TouchableRipple>
    );
  };

  if (loading || !fontsLoaded) return <LoadingScreen />;
  return (
    <View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          style={{ paddingHorizontal: 15 }}
          contentContainerStyle={styles.modal}
        >
          {tafseerLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={tafseer.results}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={Divider}
              renderItem={({ item }) => (
                <List.Item
                  title={item.type}
                  description={item.body}
                  descriptionNumberOfLines={30}
                  descriptionStyle={styles.description}
                  titleStyle={styles.title}
                />
              )}
            />
          )}
        </Modal>
      </Portal>
      <FlatList
        data={ayahs}
        keyExtractor={(item) => item.number.toString()}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <RightActions surah={number} ayah={item.number} />
            )}
          >
            <List.Item
              title={item.text}
              descriptionNumberOfLines={1}
              titleNumberOfLines={20}
              titleStyle={styles.text}
              description={`آية ${item.numberInSurah} . صفحة ${item.page}`}
            />
          </Swipeable>
        )}
      />
      {/*onPress={() => fetchTafseer(number, item.number)} */}
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
    // width: 100,
    textAlign: "right",
    padding: 16,
    borderRadius: 5,
  },
  title: {
    textAlign: "right",
    fontFamily: "Amiri_700Bold",
    fontSize: 20,
    margin: -5,
  },
  description: {
    textAlign: "right",
    fontFamily: "Amiri_400Regular",
    fontSize: 16,
  },
  actionText: {
    color: "#fff",
    paddingHorizontal: 20,
    fontSize: 25,
    fontFamily: "Amiri_400Regular",
  },
});

export default withTheme(Detail);
