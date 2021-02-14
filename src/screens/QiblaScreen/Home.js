import React, { useEffect, useState } from "react";
import { View, Animated, Easing } from "react-native";
import * as Location from "expo-location";

import LoadingScreen from "../LoadingScreen";
import { Magnetometer } from "expo-sensors";
import { point } from "@turf/helpers";
import b from "@turf/bearing";
import { withTheme, Title, Text } from "react-native-paper";

// Ref: https://github.com/rahulhaque/compass-react-native-expo
// Ref: @turf/bearing
// Ref: https://www.igismap.com/formula-to-find-bearing-or-heading-angle-between-two-points-latitude-longitude/
// Ref: hours of reading.... ended up using TurfJS to calculate the bearing afterall :/

const Home = ({ theme }) => {
  const { colors } = theme;
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [rotateValueHolder] = useState(new Animated.Value(0));
  const [bearing, setBearing] = useState(0);
  const [error, setError] = useState(null);

  const rotateData = rotateValueHolder.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        return setError(true);
      }

      let location = await Location.getCurrentPositionAsync();

      let p1 = point([location.coords.longitude, location.coords.latitude]);
      let p2 = point([39.8262, 21.4225]);
      let calcBearing = b(p1, p2);
      calcBearing = Math.round(calcBearing);
      setBearing(calcBearing);
      rotateValueHolder.setOffset(calcBearing);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    Animated.timing(rotateValueHolder, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
    _toggle();
    return () => {
      _unsubscribe();
    };
  }, []);

  const _toggle = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener((data) => {
        rotateValueHolder.setValue(360 - _angle(data));
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    subscription = null;
  };

  const _angle = (magnetometer) => {
    let angle = 0;
    if (magnetometer) {
      let { x, y, z } = magnetometer;

      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }

    return Math.round(angle);
  };

  if (loading && !error) return <LoadingScreen />;
  if (error) {
    return (
      <View
        style={{
          backgroundColor: colors.background,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text>
          Please enable location access from your device settings, and try
          again.
        </Text>
      </View>
    );
  }
  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        },
      ]}
    >
      <Animated.Image
        source={require("../../../assets/final_qibla.png")}
        style={[
          { width: 350, height: 350 },
          { transform: [{ rotate: rotateData }] },
        ]}
      />
      <Title style={{ marginTop: 10 }}>{bearing}°</Title>
    </View>
  );
};

export default withTheme(Home);
