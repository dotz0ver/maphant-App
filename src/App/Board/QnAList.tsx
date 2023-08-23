import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { listArticle, listHotBoard, listVoteBoard } from "../../Api/board";
import { Container, Spacer, TextThemed } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";
import { BoardArticle, BoardType, HotBoard, VoteBoard } from "../../types/Board";
import ScrollList from "./ScrollList";

const QnABoard: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const params = useRoute().params as { boardType: BoardType };
  const boardType = params?.boardType;
  const [boardData, setboardData] = useState<BoardArticle[]>([]);
  const [hotBoard, setHotBoard] = useState<HotBoard[]>([]);
  const [voteBoard, setVoteBoard] = useState<VoteBoard[]>([]);
  useEffect(() => {
    listHotBoard(boardType.id, 1, 5)
      .then(data => {
        if (data.data) setHotBoard(data.data.list as HotBoard[]);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    listArticle(boardType.id, 1, 10, 5, 1)
      .then(data => {
        if (data.data) setboardData(data.data.list as BoardArticle[]);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    listVoteBoard(boardType.id, 1, 5)
      .then(data => {
        if (data.data) setVoteBoard(data.data.list as VoteBoard[]);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <Container style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.total}>
          <Spacer size={20} />
          <View style={styles.hHead}>
            <TextThemed style={styles.hFont}>
              {" "}
              HOT 게시글
              <MaterialCommunityIcons name="fire" size={25} color="red" />
            </TextThemed>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("HotDetailList", { boardType: boardType });
              }}
            >
              <Text style={styles.detail}>더보기</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal>
            {hotBoard.map(board => (
              <View key={board.boardId} style={styles.content}>
                <ScrollList post={board} boardType={boardType} />
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.total}>
          <View style={styles.hHead}>
            <TextThemed style={styles.hFont}>
              {" "}
              최신 게시글 <MaterialCommunityIcons name="elephant" size={25} color="#5299EB" />
            </TextThemed>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("DetailList", { boardType: boardType });
              }}
            >
              <Text style={styles.detail}>더보기</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {boardData.map(board => (
              <View key={board.boardId} style={styles.content}>
                <ScrollList post={board} boardType={boardType} />
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.total}>
          <View style={styles.hHead}>
            <TextThemed style={styles.hFont}>
              {" "}
              투표 게시글 <MaterialCommunityIcons name="vote" size={25} color="#5299EB" />
            </TextThemed>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("VoteDetailList", { boardType: boardType });
              }}
            >
              <Text style={styles.detail}>더보기</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {voteBoard.map(board => (
              <View key={board.boardId} style={styles.content}>
                <ScrollList post={board} boardType={boardType} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: "#fff",
  },
  detail: {
    fontSize: 15,
    color: "#aaa",
    justifyContent: "flex-end",
  },
  total: {
    marginBottom: 50,
  },
  hHead: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  hFont: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    alignItems: "flex-start",
    backgroundColor: "#5299EB",
    justifyContent: "space-between",
    minWidth: 200,
    minHeight: 90,
    padding: 20,
    marginRight: 10,
    borderRadius: 25,
  },
});

export default QnABoard;
