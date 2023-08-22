import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { listBoardType } from "../../Api/board";
import SearchBar from "../../components/Input/searchbar";
import { NavigationProps } from "../../Navigator/Routes";
import { BoardType } from "../../types/Board";

const BoardList = () => {
  const [boardTypeData, setboardTypeData] = React.useState<BoardType[]>([]);
  const navigation = useNavigation<NavigationProps>();

  const splitIntoRows = (data: BoardType[], itemsPerRow: number) => {
    const rows = [];
    for (let i = 0; i < 6; i += itemsPerRow) {
      rows.push(data.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  const boardTypeDataRows = splitIntoRows(boardTypeData, 3);

  useEffect(() => {
    listBoardType()
      .then(data => {
        setboardTypeData(data.data as BoardType[]);
      })
      .catch(err => alert(err));
  }, []);

  const BoardNavigateBtn: React.FC<{ boardType: BoardType }> = ({ boardType }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("QnABoard", { boardType: boardType });
        }}
      >
        <View style={styles.boardList} key={boardType.id}>
          <Feather name="message-square" size={24} color="black" />
          <Text>{boardType.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const changePage = () => {
    navigation.navigate("HotBoard" as never);
  };

  const changeVotePage = () => {
    navigation.navigate("VoteBoard" as never);
  };

  const touch = () => {
    console.log("??????");
  };
  const handle = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={handle}>
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={{ ...styles.topic }}>
              <View style={styles.topicInner}>
                <View>
                  <Text> 오늘의 열띈 주제는? </Text>
                </View>
                <View>
                  <TouchableOpacity style={styles.btn} onPress={touch}>
                    <Text style={styles.btnFont}>투표하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ borderBottomWidth: 1 }}></View>
            <SearchBar />

            <View style={styles.board}>
              {boardTypeDataRows.map((rowData, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: "row" }}>
                  {rowData.map(boardType => (
                    <BoardNavigateBtn key={boardType.id} boardType={boardType} />
                  ))}
                </View>
              ))}
            </View>
            <View style={styles.hotStudy}>
              <View>
                <TouchableOpacity onPress={changePage} style={{ marginBottom: 30 }}>
                  <Text>
                    HOT 게시글 <MaterialCommunityIcons name="fire" size={24} color="black" />{" "}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={changeVotePage} style={{ marginBottom: 30 }}>
                  <Text>
                    투표 게시글 <MaterialCommunityIcons name="fire" size={24} color="black" />{" "}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  btnFont: {
    color: "white",
    paddingBottom: 15,
  },
  header: {
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textFont: {
    fontSize: 18,
  },
  topic: {
    flex: 3,
    backgroundColor: "skyblue",
    margin: 20,
  },
  topicInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 15,
    paddingBottom: 100,
  },
  board: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 35,
  },
  boardList: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "skyblue",
    margin: 15,
    padding: 20,
  },
  hotStudy: {
    flex: 2,
    justifyContent: "center",
    backgroundColor: "skyblue",
    margin: 20,
    padding: 15,
  },
});
export default BoardList;
export type { BoardType };
