import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { withTheme, Card, Title, Caption, Chip } from "react-native-paper";

import SalatiApi from "../../apis/SalatiApi";
import LoadingScreen from "../LoadingScreen";

import { parseISO, formatDistance } from "date-fns";
import arSA from "date-fns/locale/ar-SA/index";

const Home = ({ theme, navigation }) => {
  const [posts, setPosts] = useState([]);

  const [filteredPosts, setFilteredPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingCats, setLoadingCats] = useState(true);

  const [categories, setCategories] = useState([]);

  const [filter, setFilter] = useState(-1);

  const fetchPosts = async () => {
    setRefreshing(true);
    const response = await SalatiApi.get("/posts");
    setPosts(response.data.posts);
    setLoading(false);
    setRefreshing(false);
  };

  const filterBy = (id) => {
    setFilter(id);
    if (id == -1) return setFilteredPosts(posts);
    setFilteredPosts(posts.filter((post) => post.category?.id === id));
  };

  const fetchCategories = async () => {
    const response = await SalatiApi.get("/categories");
    setCategories(response.data.categories);
    setLoadingCats(false);
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const { colors } = theme;
  if (loading || loadingCats) return <LoadingScreen />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        data={filteredPosts.length > 0 ? filteredPosts : posts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10, paddingTop: 18 }}
        onRefresh={fetchPosts}
        refreshing={refreshing}
        ListHeaderComponent={
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={
              <Chip
                style={styles.chip}
                onPress={() => filterBy(-1)}
                selected={filter === -1}
              >
                All
              </Chip>
            }
            renderItem={({ item }) => (
              <Chip
                style={styles.chip}
                onPress={() => filterBy(item.id)}
                selected={item.id === filter}
              >
                {item.name}
              </Chip>
            )}
          />
        }
        renderItem={({ item }) => {
          return (
            <Card
              style={{ marginBottom: 18 }}
              onPress={() =>
                navigation.navigate("PostsScreenDetail", { id: item.id })
              }
            >
              <Card.Content>
                <Title style={styles.text}>{item.title}</Title>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Caption>
                    {formatDistance(parseISO(item.created_at), new Date(), {
                      locale: arSA,
                      addSuffix: true,
                    })}
                  </Caption>
                  <Caption>{item.category?.name}</Caption>
                </View>
              </Card.Content>
            </Card>
          );
        }}
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
  chip: {
    marginRight: 6,
    marginBottom: 14,
  },
});

export default withTheme(Home);
