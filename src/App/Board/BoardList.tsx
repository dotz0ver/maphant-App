import { Feather, FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import { listBoardType } from "../../Api/board";
import { GetAPI } from "../../Api/fetchAPI";
import { Spacer, TextThemed } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";
import UserStorage from "../../storage/UserStorage";
import { BoardArticle, BoardType } from "../../types/Board";
import { formatTimeDifference } from "../../utils/Time";

const VotePost: React.FC = () => {
  const [votePost, setVotePost] = useState<BoardArticle[]>([]);
  const category = useSelector(UserStorage.userCategorySelector);

  const navigation = useNavigation();

  useEffect(() => {
    GetAPI("/board/poll?&page=1&recordSize=2")
      .then(res => {
        if (res.success === true) {
          setVotePost(res.data.list);
        }
      })
      .catch(err => {
        alert("서버 오류 \n" + err);
      });
  }, [category]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const detailContent = (boardId: number) => {
    navigation.navigate("게시판", { screen: "BoardDetail", params: { id: boardId } });
  };

  const styles = StyleSheet.create({
    votePostBox: {
      backgroundColor: "red",
      flex: 2,
      // height: "33%",
      borderWidth: 1,
      borderColor: "#d1d1d1",
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    boxTitleBox: {
      height: 30,
      justifyContent: "center",
    },
    boxTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: 20,
    },
    line: {
      borderWidth: 0.7,
      borderColor: "#d1d1d1",
      marginLeft: 20,
      marginRight: 20,
    },
    postBox: {
      height: 50,
      marginLeft: 20,
      marginRight: 20,
      // backgroundColor: "yellow",
    },
    nameAndtypeBox: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      paddingLeft: 10,
      paddingRight: 10,
      // backgroundColor: "skyblue",
    },
    profileImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginRight: 10,
      borderWidth: 1,
    },
    textContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
    },

    userNickname: {
      fontSize: 15,
      fontWeight: "bold",
      // backgroundColor: "pink",
    },
    boardType: {
      fontSize: 15,
      color: "gray",
      paddingRight: 40,
    },
    titleAndbodyBox: {
      height: 20,
      //backgroundColor: "skyblue",
    },
    postTitle: {
      fontSize: 15,
      fontWeight: "bold",
    },
    postBody: {
      fontSize: 15,
      marginLeft: 5,
      // backgroundColor: "pink",
    },
    tagsBox: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 5,
    },
    tags: {
      fontSize: 15,
      color: "red",
      // backgroundColor: "skyblue",
    },
    timeAndlikeAndcomment: {
      flexDirection: "row",
      // backgroundColor: "pink",
      alignItems: "center",
      height: 25,
      justifyContent: "space-between",
    },
    likeTextWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 10,
    },
    commentTextWrapper: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconText: {
      marginLeft: 4,
    },
    timeTextWrapper: {
      width: "30%",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      // backgroundColor: "skyblue",
    },
    VotePostBox: {
      height: 290,
      justifyContent: "center",
      alignItems: "center",
    },
    noVotePostText: {
      fontSize: 20,
      fontWeight: "bold",
    },
    topicInner: {
      flexDirection: "row",
      justifyContent: "space-between",
      margin: 13,
      paddingVertical: 10,
      paddingHorizontal: 5,
      borderBottomColor: "#aaa",
      borderBottomWidth: 1,
    },
    btn: {
      backgroundColor: "#CBD7E6",
      width: 80,
      height: 30,
      padding: 15,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 4,
    },
    btnFont: {
      color: "white",
      paddingBottom: 15,
    },
  });

  if (votePost.length === 0) {
    return (
      <View style={styles.votePostBox}>
        <View style={styles.boxTitleBox}>
          <TextThemed style={styles.boxTitle}>오늘의 핫한 주제는? </TextThemed>
        </View>
        <View style={styles.line}></View>
        <View style={styles.noVotePostBox}>
          <TextThemed style={styles.noVotePostText}>게시글이 존재하지 않습니다</TextThemed>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.votePostBox}>
      <View style={styles.topicInner}>
        <View style={{ justifyContent: "center" }}>
          <TextThemed style={{ fontSize: 20 }}> 오늘의 핫한 주제는? </TextThemed>
        </View>
      </View>
      <Pressable style={styles.postBox} onPress={() => detailContent(votePost[0].boardId)}>
        <View style={styles.nameAndtypeBox}>
          {/* <Image
            source={{ uri: "https://tovelope.s3.ap-northeast-2.amazonaws.com/image_1.jpg" }}
            style={styles.profileImage}
          /> */}
          <View style={styles.textContainer}>
            <TextThemed style={styles.boardType}>{votePost[0].type}</TextThemed>
          </View>
        </View>
        <View style={styles.titleAndbodyBox}>
          <TextThemed style={styles.postTitle}>{truncateText(votePost[0].title, 20)}</TextThemed>
        </View>
        <View style={styles.timeAndlikeAndcomment}>
          <View style={{ width: "70%", flexDirection: "row" }}>
            <View style={styles.likeTextWrapper}>
              <Feather name="thumbs-up" size={13} color="tomato" />
              <TextThemed style={styles.iconText}>{votePost[0].likeCnt}</TextThemed>
            </View>
            <View style={styles.commentTextWrapper}>
              <FontAwesome name="comment-o" size={13} color="blue" />
              <TextThemed style={styles.iconText}>{votePost[0].commentCnt}</TextThemed>
            </View>
          </View>
          <View style={styles.timeTextWrapper}>
            <TextThemed>{formatTimeDifference(new Date(votePost[0].createdAt))}</TextThemed>
          </View>
        </View>
      </Pressable>
      <Spacer size={20} />
      <View style={styles.line}></View>
      <Spacer size={10} />
      <Pressable style={styles.postBox} onPress={() => detailContent(votePost[1].boardId)}>
        <View style={styles.nameAndtypeBox}>
          {/* <Image
            source={{ uri: "https://tovelope.s3.ap-northeast-2.amazonaws.com/image_1.jpg" }}
            style={styles.profileImage}
          /> */}
          <View style={styles.textContainer}>
            <TextThemed style={styles.boardType}>{votePost[1].type}</TextThemed>
          </View>
        </View>
        <View style={styles.titleAndbodyBox}>
          <TextThemed style={styles.postTitle}>{truncateText(votePost[1].title, 20)}</TextThemed>
        </View>
        <View style={styles.timeAndlikeAndcomment}>
          <View style={{ width: "70%", flexDirection: "row" }}>
            <View style={styles.likeTextWrapper}>
              <Feather name="thumbs-up" size={13} color="tomato" />
              <TextThemed style={styles.iconText}>{votePost[1].likeCnt}</TextThemed>
            </View>
            <View style={styles.commentTextWrapper}>
              <FontAwesome name="comment-o" size={13} color="blue" />
              <TextThemed style={styles.iconText}>{votePost[1].commentCnt}</TextThemed>
            </View>
          </View>
          <View style={styles.timeTextWrapper}>
            <TextThemed>{formatTimeDifference(new Date(votePost[1].createdAt))}</TextThemed>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const BoardList = () => {
  const [boardTypeData, setboardTypeData] = React.useState<BoardType[]>([]);
  const navigation = useNavigation<NavigationProps>();

  console.log(boardTypeData);
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
  const handle = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handle}>
      <View style={styles.container}>
        <VotePost />
        {/* <SearchBar /> */}
        <Spacer size={20} />
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
