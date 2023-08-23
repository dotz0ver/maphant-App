//글자 흰색으로 바뀌게
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ImageModal from "react-native-image-modal";
import { useSelector } from "react-redux";

import {
  boardComplete,
  boardDelete,
  bookMarkArticle,
  DeletebookMarkArticle,
  deleteLikeBoard,
  getArticle,
  insertLikePost,
  listArticle,
  listReportType,
  ReportPost,
} from "../../Api/board";
import { Container, IconButton, Spacer, TextButton } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";
import UIStore from "../../storage/UIStore";
import UserStorage from "../../storage/UserStorage";
import { BoardArticle, BoardPost, ReportType } from "../../types/Board";
import { UserData } from "../../types/User";
import { dateTimeFormat } from "../../utils/Time";

const QAdetail = () => {
  const params = useRoute().params as { id: number; preRender?: BoardArticle };
  const { id, preRender } = params;

  const [LoadingOverlay, setLoadingOverlay] = useState(false);

  const [post, setPost] = useState({ board: preRender, answerList: preRender } as BoardPost);
  const user = useSelector(UserStorage.userProfileSelector)! as UserData;
  const navigation = useNavigation<NavigationProps>();
  const [likeCnt, setLikeCnt] = useState(0);
  const [reportModal, setReportModal] = useState(false);
  const [reportType, setReportType] = React.useState<ReportType[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [answer, setAnswer] = useState<BoardArticle[]>([]);

  const handleDelete = async () => {
    try {
      const response = await boardDelete(id);
      navigation.goBack();

      Alert.alert("삭제되었습니다.");
    } catch (error) {
      alert(error);
    }
  };

  const handleUpdate = () => {
    navigation.navigate("editPost", { post: post });
  };

  useEffect(() => {
    getArticle(id)
      .then(data => {
        setPost(data.data);
      })
      .catch(err => Alert.alert(err));
  }, []);

  useEffect(() => {
    listArticle(7, 1, 10, 1, 1, id).then(data => {
      setAnswer(data.data.list as BoardArticle[]);
    });
  }, [post]);

  useEffect(() => {
    if (post.board === undefined && !LoadingOverlay) {
      setLoadingOverlay(true);
      UIStore.showLoadingOverlay();
    }
    if (post.board !== undefined && LoadingOverlay) {
      setLoadingOverlay(false);
      UIStore.hideLoadingOverlay();
    }

    if (post.board === undefined) return;
    setLikeCnt(post.board.likeCnt);
  }, [post, LoadingOverlay]);

  function alert() {
    Alert.alert("삭제", "삭제하시겠습니까?", [
      {
        text: "아니오",
        style: "cancel",
      },
      {
        text: "네",
        onPress: () => {
          handleDelete();
        },
      },
    ]);
  }

  const handleComplete = (answerId: number) => {
    boardComplete(id, answerId)
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        Alert.alert(error);
      });
  };

  const handleLike = async () => {
    try {
      const response = await insertLikePost(id);
      post.board.isLike = true;
      setLikeCnt(likeCnt + 1);
      console.log(response);
    } catch (error) {
      Alert.alert(error);
    }
  };
  const likeDelete = async () => {
    try {
      const response = await deleteLikeBoard(id);
      post.board.isLike = false;
      setLikeCnt(likeCnt - 1);
      console.log("취소", response);
    } catch (error) {
      Alert.alert(error);
    }
  };

  const handleBookmarkToggle = async (board_id: number) => {
    try {
      if (isBookmarked) {
        await DeletebookMarkArticle(board_id);
        Alert.alert("북마크 삭제되었습니다.");
      } else {
        await bookMarkArticle(id);
        Alert.alert("북마크 추가되었습니다.");
      }
      setIsBookmarked(!isBookmarked); // 토글 상태 업데이트
    } catch (error) {
      Alert.alert(error);
    }
  };

  // if (post.board === undefined) {
  //   return <></>;
  // }

  useEffect(() => {
    listReportType()
      .then(data => {
        setReportType(data.data as ReportType[]);
      })
      .catch(err => console.log(err));
  }, []);

  const handleReport = async (board_id: number, reportType_id: number) => {
    try {
      const response = await ReportPost(board_id, reportType_id);
      Alert.alert("신고되었습니다.");
      console.log(response);
    } catch (error) {
      Alert.alert(error);
    }
  };
  if (post.board === undefined) {
    return <></>;
  }

  const ModalWrapper = () => {
    const [selectedReportIndex, setSelectedReportIndex] = React.useState<number>();

    return (
      <Modal animationType="fade" transparent={true} visible={reportModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {reportType.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedReportIndex(index);
                }}
                style={[
                  styles.reportItem,
                  selectedReportIndex === index && styles.selectedReportItem,
                  // 선택된 항목의 경우 스타일 적용
                ]}
              >
                <Text style={styles.reportContent}>{item.name}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalBtnDirection}>
              <TextButton style={styles.modalConfirmBtn} onPress={() => setReportModal(false)}>
                취소
              </TextButton>
              <TextButton
                style={styles.modalConfirmBtn}
                onPress={() => {
                  // 수정된 닉네임 server 전송
                  if (selectedReportIndex !== null) {
                    console.log(selectedReportIndex);
                    handleReport(id, selectedReportIndex);
                  }
                }}
              >
                신고
              </TextButton>
            </View>
            <Spacer size={5} />
          </View>
        </View>
      </Modal>
    );
  };

  // const report =
  return (
    <Container style={styles.container}>
      <ModalWrapper />
      <View style={styles.qainfoBox}>
        <View>
          <View style={styles.qaheader}>
            <View>
              <View>
                <Text style={styles.nickname}>{post.board.userNickname}</Text>
              </View>
              <View>
                <Text style={styles.date}>{dateTimeFormat(post.board.createdAt)}</Text>
              </View>
            </View>
            {post.board.isMyBoard && (
              <View style={styles.qaButtonBox}>
                <TextButton style={styles.button} fontColor={"#000"} onPress={handleUpdate}>
                  수정
                </TextButton>
                <TextButton style={styles.button} fontColor={"#000"} onPress={alert}>
                  삭제
                </TextButton>
              </View>
            )}
          </View>
          <View style={styles.qacontextBox}>
            <View>
              <Text style={styles.qatitle}>{post.board.title}</Text>
            </View>
            <View>
              <Text style={styles.qacontext}>{post.board.body}</Text>
              {post.board.imagesUrl != null && (
                <ScrollView horizontal={true} style={styles.imageContainer}>
                  {post.board.imagesUrl.map((imageUrl, index) => (
                    <ImageModal
                      key={index}
                      swipeToDismiss={false}
                      resizeMode="contain"
                      style={{
                        height: 200,
                        width: 200,
                      }}
                      source={{ uri: imageUrl }}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </View>

        <View style={styles.cbutBox}>
          <IconButton
            name="thumbs-o-up"
            color="skyblue"
            onPress={() => {
              post.board.isLike ? likeDelete() : handleLike();
            }}
          >
            {likeCnt === 0 ? "추천" : likeCnt}
          </IconButton>
          <IconButton name="star-o" color="orange" onPress={() => handleBookmarkToggle(id)}>
            북마크
          </IconButton>
          {/* {modal()} */}
          <IconButton
            name="exclamation-circle"
            color="red"
            onPress={() => {
              setReportModal(true);
            }}
          >
            신고
          </IconButton>

          <IconButton
            name="comment-o"
            color="purple"
            onPress={() => navigation.navigate("QA_answer", { id: id })}
          >
            답변
          </IconButton>
        </View>
      </View>
      <ScrollView style={styles.scroll}>
        {!answer ? (
          <View></View>
        ) : (
          answer.map(answer => (
            <View style={styles.answerBox} key={answer.id}>
              <View style={styles.line} />
              <View style={{ margin: "3%" }}>
                <View style={styles.answerheader}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.answername}>{answer.userNickname}</Text>
                    <Text style={styles.answerdate}>{dateTimeFormat(answer.createdAt)}</Text>
                  </View>
                  <View style={styles.cbutBox}>
                    <IconButton
                      name="lightbulb-o"
                      color="purple"
                      onPress={() => {
                        handleComplete(answer.id);
                      }}
                    >
                      채택
                    </IconButton>
                    <IconButton
                      name="thumbs-o-up"
                      color="skyblue"
                      onPress={() => {
                        answer.isLike ? likeDelete() : handleLike();
                      }}
                    >
                      {likeCnt === 0 ? "추천" : likeCnt}
                    </IconButton>
                    <IconButton
                      name="exclamation-circle"
                      color="red"
                      onPress={() => {
                        setReportModal(true);
                      }}
                    >
                      신고
                    </IconButton>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("BoardDetail", { id: answer.id })}
                >
                  <View style={styles.answercontext}>
                    <Text style={styles.qatitle}>{answer.title}</Text>
                    <Text numberOfLines={3} style={styles.qacontext}>
                      {answer.body}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  nameBox: {
    flex: 1,
    padding: "3%",
    justifyContent: "space-between",
  },
  headername: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 4,
  },
  qainfoBox: {
    justifyContent: "space-between",
    flex: 5,
    padding: "4%",
  },
  qaheader: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  qaButtonBox: {
    flexDirection: "row",
  },
  nickname: {
    fontSize: 20,
  },
  date: {
    marginLeft: 5,
    fontSize: 10,
    color: "gray",
  },
  qacontextBox: {
    margin: "5%",
  },
  qatitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  qacontext: {
    marginTop: 10,
    marginLeft: 5,
    fontSize: 17,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 15,
    backgroundColor: "#f2f2f2",
    marginRight: 10,
  },

  cbutBox: {
    flexDirection: "row",
  },
  answerBox: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#f2f2f2",
  },
  answerheader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  answername: {
    fontSize: 15,
    marginRight: 5,
  },
  answerdate: {
    marginTop: 5,
    fontSize: 11,
    color: "lightgray",
  },
  answercontext: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  // touchdetail: {
  //   margin: "3%",
  // },
  scroll: {
    height: "30%",
  },
  modalBackground: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 0.8,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    padding: 15,
  },
  modalInput: {
    width: "100%",
    paddingVertical: "5%",
    backgroundColor: "#D8E1EC",
  },
  modalBtnDirection: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalConfirmBtn: {
    width: "45%",
  },
  reportContent: {
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  reportItem: {
    padding: 8,
  },
  selectedReportItem: {
    backgroundColor: "#5299EB",
  },
  imageContainer: {
    flexDirection: "row",
    marginTop: "10%",
  },
});

export default QAdetail;
