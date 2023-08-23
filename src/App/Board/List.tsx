//글자 흰색으로
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { listArticle, listSortCriterion, searchArticle } from "../../Api/board";
import { Container, TextButton } from "../../components/common";
import SearchBar from "../../components/Input/searchbar";
import { NavigationProps } from "../../Navigator/Routes";
import { BoardArticle, BoardType, SortType } from "../../types/Board";
import PostSummary from "./PostSummary";

const DetailList: React.FC = () => {
  const params = useRoute().params as { boardType: BoardType };
  const boardType = params?.boardType;
  const [boardData, setboardData] = useState<BoardArticle[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProps>();
  const [searchText, setSearchText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<BoardArticle[]>([]);
  const [sortType, setsortType] = React.useState<SortType[]>([]);
  const [page, setPage] = React.useState<number>(2);

  const [sort, setSort] = React.useState<number>(1);
  useEffect(() => {
    listSortCriterion()
      .then(data => {
        setsortType(data.data as SortType[]);
      })
      .catch(err => alert(err));
  }, [boardType]);

  const handleSortChange = (selectedSortId: number) => {
    // 선택된 정렬 유형을 id로 찾습니다.
    setSort(selectedSortId);
  };

  const fetchData = async () => {
    try {
      if (!boardType) {
        setRefreshing(false);
        return;
      }
      // const data = await listArticle(boardType.id, 1, 1, 1);
      const data = await listArticle(boardType.id, 1, 10, 10, sort, -1);
      if (data.data) {
        setboardData(data.data.list as BoardArticle[]);
      }
    } catch (err) {
      Alert.alert(err);
    } finally {
      setRefreshing(false);
    }
  };

  const pageFunc = async () => {
    setPage(page + 1);
    await listArticle(boardType.id, page, 10, 10, sort, -1).then(data => {
      setboardData(boardData.concat(data.data.list as BoardArticle[]));
    });
  };
  const onRefresh = async () => {
    setRefreshing(true);
    setPage(2);
    fetchData();
  };

  const handleSearch = async (searchText: string) => {
    setSearchText(searchText);
    setSearchQuery(searchText);
    if (searchText.trim() === "") {
      setSearchResults([]);
      console.log("searchText is empty");

      return;
    }
    try {
      const data = await searchArticle(searchText, boardType.id); // Implement your searchArticle function to call the API for search results
      setSearchResults(data.data.list as BoardArticle[]);
      console.log(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sort]);

  const createBoard = () => {
    navigation.navigate("Post", { boardType: boardType });
  };

  const detailContent = (board: BoardArticle) => {
    if (boardType.id == 2) {
      navigation.navigate("QnAdetail", { id: board.boardId });
    } else {
      navigation.navigate("BoardDetail", { id: board.boardId });
    }
  };

  const displayData = searchQuery.trim() === "" ? boardData : searchResults;

  return (
    <Container style={styles.container}>
      <SearchBar
        onSearchChange={handleSearch}
        onClearText={() => {
          setSearchQuery("");
          setSearchText("");
        }}
        searchQuery={searchText}
      />
      <View style={styles.sortContainer}>
        <View
          style={{
            borderRightColor: "#aaa",
            borderRightWidth: 2,
          }}
        >
          <TouchableOpacity onPress={createBoard} style={styles.sortKey}>
            <Entypo name="plus" size={20} color="#666666" />
            <Text style={{ color: "#666666", fontSize: 14 }}> 글 작성하기</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          {sortType.map((sort, index) => (
            <TouchableOpacity key={index}>
              <TextButton
                key={sort.id}
                onPress={() => {
                  handleSortChange(sort.id);
                }} // 선택된 정렬 유형 id를 핸들러에 전달합니다.
                style={styles.sortKey}
                fontColor="#666666"
                fontSize={14}
              >
                {sort.id === 1 ? "최신 순" : sort.id === 2 ? "좋아요 순" : ""}
              </TextButton>
            </TouchableOpacity>
          ))}
          <FontAwesome name="sort" size={24} color="#666666" />
        </View>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={displayData}
        renderItem={({ item: board }) => (
          <View key={board.boardId} style={styles.body}>
            <Pressable onPress={() => detailContent(board)}>
              <PostSummary post={board} boardType={boardType} />
            </Pressable>
          </View>
        )}
        onEndReached={() => pageFunc()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  body: {
    borderTopColor: "#E0E0E0",
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  btn: {
    backgroundColor: "#CBD7E6",
    borderRadius: 30,
    padding: 10,
  },
  sortContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sortKey: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 11,
    marginHorizontal: 10,
    backgroundColor: "#CBD7E6",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

export default DetailList;
