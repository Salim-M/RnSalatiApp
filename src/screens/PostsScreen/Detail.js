import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { withTheme, Headline, Divider } from "react-native-paper";

import { WebView } from "react-native-webview";

import SalatiApi from "../../apis/SalatiApi";
import LoadingScreen from "../LoadingScreen";

const Detail = ({ theme, route }) => {
  const { colors } = theme;
  const { id } = route.params;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await SalatiApi.get(`/posts/${id}`);
      setPost(response.data.post);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <WebView
        originWhitelist={["*"]}
        style={{
          backgroundColor: colors.background,
          marginVertical: 20,
        }}
        source={{
          html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{color: #fff; direction: rtl;}img{border-radius:2px}</style></head><body>${post.body}</body></html>`,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headline: {
    textAlign: "right",
    padding: 10,
  },
});

export default withTheme(Detail);
