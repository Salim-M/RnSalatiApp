import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { withTheme, Card, Title, Caption } from "react-native-paper";

import SalatiApi from "../../apis/SalatiApi";
import LoadingScreen from "../LoadingScreen";

const Home = ({ theme, navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    setRefreshing(true);
    const response = await SalatiApi.get("/posts");
    setPosts(response.data.posts);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const { colors } = theme;
  if (loading) return <LoadingScreen />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        data={posts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10, paddingTop: 18 }}
        onRefresh={fetchPosts}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <Card
            style={{ marginBottom: 18 }}
            onPress={() =>
              navigation.navigate("PostsScreenDetail", { id: item.id })
            }
          >
            <Card.Content>
              <Title style={styles.text}>{item.title}</Title>
              <Caption style={styles.text}>{item.category?.name}</Caption>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    textAlign: "right",
  },
});

export default withTheme(Home);
