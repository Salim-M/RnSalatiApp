import React, { useEffect, useState } from "react";
import { withTheme } from "react-native-paper";

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
    <WebView
      originWhitelist={["*"]}
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: colors.background,
        flex: 1,
      }}
      source={{
        html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{direction: rtl;color: #f8f8ff;}img { display: block; max-width: 100%; height: auto; }</style></head><body>${post.body}</body></html>`,
      }}
    />
  );
};

export default withTheme(Detail);
