import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  AppState,
  ScrollView,
} from "react-native";

import {
  Surface,
  Text,
  Title,
  Subheading,
  Caption,
  List,
  withTheme,
  Dialog,
  Portal,
  Paragraph,
} from "react-native-paper";

import { format, differenceInSeconds } from "date-fns";
import arSA from "date-fns/locale/ar-SA/index";

import * as SQLite from "expo-sqlite";
import TimesApi from "../apis/TimesApi";
import * as Notifications from "expo-notifications";
const db = SQLite.openDatabase("appstorage.db");
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const Home = ({ theme }) => {
  const { colors } = theme;

  const [prayers, setPrayers] = useState(null);
  const [next, setNext] = useState(null);
  const [date, setDate] = useState(null);
  const [visible, setVisible] = React.useState(false);

  const TASK_NAME = "SET_PRAYER_NOTIFICATIONS";

  const appState = useRef(AppState.currentState);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      getPrayer();
    }

    appState.current = nextAppState;
  };

  const updatePrayers = async () => {
    setVisible(true);
    const response = await TimesApi.get("/timetable");

    db.transaction((tx) => {
      tx.executeSql(`DELETE FROM prayers;`);
      response.data.forEach((prayerObject) => {
        tx.executeSql(
          `INSERT INTO prayers(miladiDate, fajir, shourouk, zohor, asr, maghrib, ishaa) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            prayerObject.milaidiDate,
            prayerObject.fajir,
            prayerObject.shourouk,
            prayerObject.zohor,
            prayerObject.assr,
            prayerObject.moghrib,
            prayerObject.ishaa,
          ]
        );
      });
    });
    setVisible(false);
    getPrayer();
  };

  //Ref: https://stackoverflow.com/questions/13898423/javascript-convert-24-hour-time-of-day-string-to-12-hour-time-with-am-pm-and-no
  const tConvert = (time) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)/) || [time];

    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? " AM" : " PM";
      time[0] = +time[0] % 12 || 12;
    }
    return time.join("");
  };

  const getPrayer = (nextDay = false) => {
    // TODO: Split the code into reusable code
    const date = new Date();
    if (nextDay) {
      date.setDate(date.getDate() + 1);
    }
    const today = date.toISOString().split("T")[0];

    setDate(
      format(date, "cccc، d LLLL yyyy", {
        locale: arSA,
      })
    );
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM prayers WHERE miladiDate = ?`,
        [today],
        (_, result) => {
          if (result.rows.length === 1) {
            setPrayers(result.rows._array[0]);
            if (nextDay)
              return setNext({
                name: "Fajr",
                time: result.rows._array[0].fajir,
              });
            const compareTo = [
              { name: "Fajr", time: result.rows._array[0].fajir },
              {
                name: "Dhuhr",
                time: result.rows._array[0].zohor,
              },
              { name: "Asr", time: result.rows._array[0].asr },
              {
                name: "Maghrib",
                time: result.rows._array[0].maghrib,
              },
              {
                name: "Ishaa",
                time: result.rows._array[0].ishaa,
              },
            ];
            let upcoming = null;
            for (let i = 0; i < compareTo.length; i++) {
              if (Number(compareTo[i].time.split(":")[0]) > date.getHours()) {
                upcoming = compareTo[i];
                break;
              } else if (
                Number(compareTo[i].time.split(":")[0]) == date.getHours() &&
                Number(compareTo[i].time.split(":")[1]) >= date.getMinutes()
              ) {
                upcoming = compareTo[i];
                break;
              }
            }
            if (upcoming != null) {
              setNext(upcoming);
              const target = new Date();
              target.setHours(upcoming.time.split(":")[0]);
              target.setMinutes(upcoming.time.split(":")[1]);
              const result = differenceInSeconds(target, new Date());
              (async () => {
                const response = await Notifications.getAllScheduledNotificationsAsync();
                if (response.length === 0)
                  await Notifications.scheduleNotificationAsync({
                    content: {
                      title: `${upcoming.name} at ${tConvert(upcoming.time)}`,
                      body: "🕒 View prayer times in Lebanon",
                    },
                    trigger: {
                      seconds: result,
                    },
                  });
              })();
            } else {
              // move to the next day prayers
              getPrayer(true);
            }
          } else {
            updatePrayers();
          }
        }
      );
    });
  };

  useEffect(() => {
    TaskManager.defineTask(TASK_NAME, () => getPrayer(false));
    BackgroundFetch.registerTaskAsync(TASK_NAME, {
      stopOnTerminate: false,
      startOnBoot: true,
    });

    db.transaction((tx) => {
      tx.executeSql(
        `create table if not exists prayers (id integer primary key not null, miladiDate text, fajir text, shourouk text, zohor text, asr text, maghrib text, ishaa text);`,
        [],
        () => getPrayer(false)
      );
    });
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background, flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <Portal>
        <Dialog visible={visible} dismissable={false}>
          <Dialog.Title>Notice</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Initializing ...</Paragraph>
          </Dialog.Content>
        </Dialog>
      </Portal>
      <ImageBackground
        source={require("../../assets/home_Image.jpg")}
        style={{ height: 360 }}
        imageStyle={styles.topImage}
      >
        <View style={[styles.onTopContainer]}>
          <View style={styles.roundedContainer}>
            <Caption>Next</Caption>
            <Title>{next ? next.name : "—"}</Title>
            <Subheading>{next ? tConvert(next.time) : "—"}</Subheading>
          </View>
          <Text>{date}</Text>
        </View>
      </ImageBackground>
      <View style={[styles.prayersContainer]}>
        <Surface style={{ elevation: 1, borderRadius: 10 }}>
          <List.Item
            title="Fajr"
            description={prayers ? tConvert(prayers.fajir) : "—"}
            left={(props) => <List.Icon {...props} icon="weather-sunset-up" />}
          />
          <List.Item
            title="Dhuhr"
            description={prayers ? tConvert(prayers.zohor) : "—"}
            left={(props) => <List.Icon {...props} icon="weather-sunny" />}
          />
          <List.Item
            title="Asr"
            description={prayers ? tConvert(prayers.asr) : "—"}
            left={(props) => <List.Icon {...props} icon="weather-sunset" />}
          />
          <List.Item
            title="Maghrib"
            description={prayers ? tConvert(prayers.maghrib) : "—"}
            left={(props) => (
              <List.Icon {...props} icon="weather-sunset-down" />
            )}
          />
          <List.Item
            title="Ishaa"
            description={prayers ? tConvert(prayers.ishaa) : "—"}
            left={(props) => <List.Icon {...props} icon="weather-night" />}
          />
        </Surface>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topImage: {
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    height: 360,
  },
  roundedContainer: {
    width: 136,
    height: 136,
    borderRadius: 68,
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  prayersContainer: {
    padding: 15,
  },
  onTopContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default withTheme(Home);
