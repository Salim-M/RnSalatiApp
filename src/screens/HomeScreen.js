import React, { useEffect, useState } from "react";
import { StyleSheet, View, ImageBackground } from "react-native";

import {
  Surface,
  Text,
  Title,
  Subheading,
  Caption,
  List,
} from "react-native-paper";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";

import * as SQLite from "expo-sqlite";
import TimesApi from "../apis/TimesApi";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
const db = SQLite.openDatabase("appstorage.db");
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
export default function HomeScreen() {
  const [prayers, setPrayers] = useState(null);
  const [next, setNext] = useState(null);
  const [date, setDate] = useState("");

  const schedulePushNotification = async (salat, time) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: salat + " at " + tConvert(time),
        body: "🕒 View prayer times in Lebanon",
      },
      trigger: { seconds: time },
    });
  };

  // TaskManager.defineTask("UPDATE_PRAYER_NOTIFICATIONS", async () => {
  //   // const response = await Notifications.getAllScheduledNotificationsAsync();
  //   // if (response.length === 0 && prayers != null) {
  //   //   // //Schedule
  //   //   schedulePushNotification("fajir", 3);
  //   //   schedulePushNotification("zohor", 6);

  //   //   // schedulePushNotification("zohor", 9);
  //   //   // console.log("done");
  //   // }
  //   console.log("backkkk");
  //   return BackgroundFetch.Result.NoData;
  // });

  const updatePrayers = async () => {
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
            // schedulePrayers();
            // const d = new Date();
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
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    // (async () => {
    //   await BackgroundFetch.registerTaskAsync("UPDATE_PRAYER_NOTIFICATIONS", {
    //     startOnBoot: true,
    //     stopOnTerminate: false,
    //   });
    // })();
    db.transaction((tx) => {
      tx.executeSql(
        `create table if not exists prayers (id integer primary key not null, miladiDate text, fajir text, shourouk text, zohor text, asr text, maghrib text, ishaa text);`,
        [],
        () => getPrayer(false)
      );
    });

    // (() => {
    //   // const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //   // await Notifications.presentNotificationAsync({
    //   //   title: 'Look at that notification',
    //   //   body: "I'm so proud of myself!",
    //   // });

    //   // Second, call the method

    //   // Notifications.scheduleNotificationAsync({
    //   //   content: {
    //   //     title: "Look at that notification",
    //   //     body: "🕒 Prayer times in Lebanon.",
    //   //   },
    //   //   trigger: { seconds: 5 },
    //   // });
    // })();
  }, []);
  // const schedulePrayers = async () => {
  //   const response = await Notifications.getAllScheduledNotificationsAsync();
  //   if (response.length === 0 && prayers != null) {
  //     // //Schedule
  //     // schedulePushNotification("fajir", 3);
  //     // schedulePushNotification("zohor", 6);
  //     // schedulePushNotification("zohor", 9);
  //     // console.log("done");
  //   }
  // };

  return (
    <>
      <ImageBackground
        source={require("../../assets/img/home_Image.jpg")}
        style={{ height: 400 }}
        imageStyle={styles.topImage}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.roundedContainer}>
            <Caption>Next</Caption>
            <Title>{next ? next.name : "—"}</Title>
            <Subheading>{next ? tConvert(next.time) : "—"}</Subheading>
          </View>
          <Text>{date}</Text>
        </View>
      </ImageBackground>
      <View style={{ padding: 15, flex: 1 }}>
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
    </>
  );
}

const styles = StyleSheet.create({
  topImage: {
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    height: 380,
  },
  roundedContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
});
