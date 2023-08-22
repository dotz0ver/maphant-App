//글자 흰색으로
import { Entypo } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<BoardArticle[]>([]);
  const [sortType, setsortType] = React.useState<SortType[]>([]);
  const [page, setPage] = React.useState<number>(2);

  const [sort, setSort] = React.useState<number>(1);
  useEffect(() => {
    listSortCriterion()
      .then(data => {
        setsortType(data.data as SortType[]);
        console.log(data.data);
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
      const data = await listArticle(boardType.id, 1, 10, 10, sort);
      if (data.data) {
        setboardData(data.data.list as BoardArticle[]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  const pageFunc = async () => {
    setPage(page + 1);
    await listArticle(boardType.id, page, 10, 10, sort).then(data => {
      setboardData(boardData.concat(data.data.list as BoardArticle[]));
    });
  };
  const onRefresh = async () => {
    setRefreshing(true);
    setPage(2);
    fetchData();
  };

  const handleSearch = async (searchText: string) => {
    setSearchQuery(searchText);
    if (searchText.trim() === "") {
      setSearchResults([]);
      console.log("searchText is empty");
      return;
    }
    try {
      const data = await searchArticle(searchText, boardType.id); // Implement your searchArticle function to call the API for search results
      setSearchResults(data.data as BoardArticle[]);
      console.log(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sort]);

  const createBoard = () => {
    console.log("글쓰기 화면으로 바뀌어야함");
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
      <SearchBar onSearchChange={handleSearch} />
      <TouchableOpacity style={styles.sortContainer}>
        {sortType.map((sort, index) => (
          <View key={index}>
            <TextButton
              key={sort.id}
              onPress={() => {
                handleSortChange(sort.id);
                console.log(sort);
              }} // 선택된 정렬 유형 id를 핸들러에 전달합니다.
              style={styles.sortKey}
            >
              {sort.name}
            </TextButton>
          </View>
        ))}
      </TouchableOpacity>

      <FlatList
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
      <View style={styles.btn}>
        <TouchableOpacity onPress={createBoard}>
          <Text>
            <Entypo name="plus" size={24} color="black" />
          </Text>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingVertical: 10,
  },
  btn: {
    backgroundColor: "#e9ecef",
    borderRadius: 30,
    zIndex: 99,
    position: "absolute",
    right: "10%",
    bottom: "5%",
    padding: 10,
  },
  sortContainer: {
    flexDirection: "row",
  },
  sortKey: {
    backgroundColor: "#5299EB",
    marginRight: "5%",
    width: 120, // 원하는 너비로 조절
    height: 50,
  },
});

export default DetailList;
