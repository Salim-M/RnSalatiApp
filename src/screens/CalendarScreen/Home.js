import React, { useState, useEffect, useLayoutEffect } from "react";
import { View } from "react-native";
import { withTheme, List, Divider } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import AladhanApi from "../../apis/AladhanApi";

const CalendarScreen = ({ theme }) => {
  const { colors } = theme;
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);

  const [dayInfo, setDayInfo] = useState(null);

  const fetchMarkedDatesForMonth = async (month, year) => {
    setDayInfo(null);
    setLoading(true);
    try {
      const response = await AladhanApi.get(`/gToHCalendar/${month}/${year}`);

      const arr = response.data.data
        .filter((obj) => {
          if (obj.hijri.holidays.length > 0) {
            return true;
          }
          return false;
        })
        .map((obj) => {
          const key = obj.gregorian.date.split("-").reverse().join("-");

          return {
            key: key,
            value: {
              marked: true,
              selected: true,
              info: {
                title: obj.hijri.holidays[0],
                description: `${obj.hijri.day} ${obj.hijri.month.en}`,
              },
            },
          };
        });
      var result = {};
      for (var i = 0; i < arr.length; i++) {
        result[arr[i].key] = arr[i].value;
      }
      //   Contact me if you have a better idea... :/
      setMarkedDates(result);
      setLoading(false);
    } catch (e) {}
  };

  useEffect(() => {
    const d = new Date();
    const m = d.getMonth();
    const y = d.getFullYear();
    fetchMarkedDatesForMonth(m, y);
  }, []);

  const selectDate = (date) => {
    for (var key in markedDates) {
      if (key === date) {
        setDayInfo(markedDates[key].info);
        break;
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Calendar
        markedDates={markedDates}
        onDayPress={(date) => {
          selectDate(date.dateString);
        }}
        onMonthChange={(date) =>
          fetchMarkedDatesForMonth(date.month, date.year)
        }
        enableSwipeMonths={true}
        theme={{
          backgroundColor: "#121212",
          calendarBackground: "#121212",
          textSectionTitleColor: "#fff",
          textSectionTitleDisabledColor: "#cacaca",
          selectedDayBackgroundColor: "#4caf50",
          selectedDayTextColor: "#fff",
          todayTextColor: "#4caf50",
          dayTextColor: "#808080",
          textDisabledColor: "#cacaca",
          dotColor: "#4caf50",
          selectedDotColor: "#fff",
          arrowColor: "#fff",
          disabledArrowColor: "#cacaca",
          monthTextColor: "#fff",
          indicatorColor: "#fff",
          textDayFontWeight: "300",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "300",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />
      <Divider />
      {dayInfo ? (
        <List.Item
          title={dayInfo.title}
          description={dayInfo.description}
          left={(props) => <List.Icon {...props} icon="progress-check" />}
        />
      ) : null}
    </View>
  );
};

export default withTheme(CalendarScreen);
