import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { listHotBoardTotal } from "../../Api/board";
import { Container } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";
import { BoardType, HotBoard } from "../../types/Board";
import PostSummary from "./PostSummary";

const TotalList = () => {
  const params = useRoute().params as { boardType: BoardType };
  const boardType = params?.boardType;
  const navigation = useNavigation<NavigationProps>();

  const [boardData, setboardData] = useState<HotBoard[]>([]);

  useEffect(() => {
    listHotBoardTotal(1, 50).then(data => setboardData(data.data.list as HotBoard[]));
  }, []);
  const detailContent = (typeId: number, boardId: number) => {
    if (typeId == 2) {
      navigation.navigate("QnAdetail", { id: boardId });
    } else {
      navigation.navigate("BoardDetail", { id: boardId });
    }
  };
  return (
    <Container style={styles.container}>
      <ScrollView>
        {boardData.map(board => (
          <View key={board.boardId} style={styles.body}>
            <Pressable onPress={() => detailContent(board.typeId, board.boardId)}>
              <Text style={styles.board}>{board.type}</Text>
              <PostSummary post={board} boardType={boardType} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  board: {
    fontSize: 10,
    color: "gray",
  },
  body: {
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingVertical: 10,
  },
});

export default TotalList;
