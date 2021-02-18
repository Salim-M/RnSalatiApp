import * as Notifications from "expo-notifications";
import { differenceInSeconds } from "date-fns";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("appstorage.db");

module.exports = async (taskData) => {
  // do stuff
  const date = new Date();
  const today = date.toISOString().split("T")[0];

  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM prayers WHERE miladiDate = ?`,
      [today],
      (_, result) => {
        if (result.rows.length === 1) {
          // found today prayers...
          const prayerTimes = [
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
          (async () => {
            const response = await Notifications.getAllScheduledNotificationsAsync();
            if (response.length === 0) {
              // no registered notifications
              const target = new Date();

              for (let i = 0; i < prayerTimes.length; i++) {
                target.setHours(prayerTimes[i].time.split(":")[0]);
                target.setMinutes(prayerTimes[i].time.split(":")[1]);
                (async () => {
                  await Notifications.scheduleNotificationAsync({
                    content: {
                      title: `${prayerTimes[i].name} at ${prayerTimes[i].time}`,
                      body: "🕒 View prayer times in Lebanon",
                    },
                    trigger: {
                      seconds: differenceInSeconds(target, new Date()),
                    },
                  });
                })();
              }
            }
          })();
        }
      }
    );
  });
};
