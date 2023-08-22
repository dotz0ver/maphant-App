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
  useWindowDimensions,
  View,
} from "react-native";

import { listBoardType } from "../../Api/board";
import { Spacer } from "../../components/common";
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

  const boardTypeDataRows = splitIntoRows(boardTypeData, 2);
  const { height, width } = useWindowDimensions();

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
          <Feather name="message-square" size={24} color="#fff" style={{ paddingVertical: 5 }} />
          <Text style={{ fontSize: 13, paddingBottom: 5 }}>{boardType.name}</Text>
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
    <TouchableWithoutFeedback onPress={handle}>
      <View style={styles.container}>
        <Spacer size={20} />
        <View style={{ ...styles.topic }}>
          <View style={styles.topicInner}>
            <View style={{ justifyContent: "center" }}>
              <Text style={{ fontSize: 17 }}> 오늘의 핫한 주제는? </Text>
            </View>
            <TouchableOpacity style={styles.btn} onPress={touch}>
              <Text style={styles.btnFont}>투표하기</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <SearchBar /> */}

        <View style={styles.board}>
          {boardTypeDataRows.map((rowData, rowIndex) => (
            <View
              key={rowIndex}
              style={{
                width: width / 3.5,
                height: 300,
              }}
            >
              {rowData.map(boardType => (
                <BoardNavigateBtn key={boardType.id} boardType={boardType} />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.hotStudy}>
          <View style={{ justifyContent: "center", borderRightWidth: 1, borderRightColor: "#aaa" }}>
            <TouchableOpacity onPress={changePage} style={{ marginHorizontal: 20 }}>
              <Text style={{ fontSize: 18 }}>
                HOT 게시글 <MaterialCommunityIcons name="fire" size={24} color="black" />
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: "center" }}>
            <TouchableOpacity onPress={changeVotePage} style={{ marginHorizontal: 20 }}>
              <Text style={{ fontSize: 18 }}>
                투표 게시글 <MaterialCommunityIcons name="fire" size={24} color="black" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Spacer size={30} />
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  btn: {
    backgroundColor: "#666666",
    width: 80,
    height: 40,
    padding: 15,
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
    flex: 1,
    backgroundColor: "#CBD7E6",
    margin: 20,
    borderRadius: 15,
  },
  topicInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomColor: "#aaa",
    borderBottomWidth: 1,
  },
  board: {
    flex: 1,
    flexDirection: "row",
    // alignItems: "stretch",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderTopColor: "#aaa",
    borderTopWidth: 1,
    borderBottomColor: "#aaa",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    paddingTop: 10,
    marginHorizontal: 15,
  },
  boardList: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CBD7E6",
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  hotStudy: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#CBD7E6",
    marginVertical: 10,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 15,
  },
});
export default BoardList;
export type { BoardType };
