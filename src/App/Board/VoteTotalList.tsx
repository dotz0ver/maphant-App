import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { listVoteBoardTotal } from "../../Api/board";
import { NavigationProps } from "../../Navigator/Routes";
import { BoardType, VoteBoard } from "../../types/Board";
import PostSummary from "./PostSummary";

const VoteTotalList = () => {
  const params = useRoute().params as { boardType: BoardType };
  const boardType = params?.boardType;
  const navigation = useNavigation<NavigationProps>();

  const [voteBoardData, setVoteBoardData] = useState<VoteBoard[]>([]);

  useEffect(() => {
    listVoteBoardTotal(1, 50).then(data => setVoteBoardData(data.data.list as VoteBoard[]));
  }, []);
  const voteDetailContent = (typeId: number, boardId: number) => {
    if (typeId == 2) {
      navigation.navigate("QnAdetail", { id: boardId });
    } else {
      navigation.navigate("BoardDetail", { id: boardId });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {voteBoardData.map(board => (
        <View key={board.boardId} style={styles.body}>
          <Pressable onPress={() => voteDetailContent(board.typeId, board.boardId)}>
            <Text style={styles.board}>{board.type}</Text>
            <PostSummary post={board} boardType={boardType} />
          </Pressable>
        </View>
      ))}
    </ScrollView>
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

export default VoteTotalList;
