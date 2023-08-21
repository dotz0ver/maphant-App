import { useNavigation, useRoute } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import {
  boardDelete,
  bookMarkArticle,
  commentArticle,
  commentDelete,
  commentInsert,
  commentLike,
  commentReply,
  DeletebookMarkArticle,
  deleteLikeBoard,
  deletePoll,
  doPoll,
  getArticle,
  getPollId,
  insertLikePost,
  listReportType,
  pollStatus,
  ReportComment,
  ReportPost,
} from "../../Api/board";
import { Container, IconButton, Input, Spacer, TextButton } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";
import UIStore from "../../storage/UIStore";
import UserStorage from "../../storage/UserStorage";
import { BoardArticleBase, BoardPost, commentType, ReportType } from "../../types/Board";
import { UserData } from "../../types/User";
import { dateFormat, dateTimeFormat } from "./Time";

const BoardDetail = () => {
  const params = useRoute().params as { id: number; preRender?: BoardArticleBase };
  const { id, preRender } = params;

  const [poll, setPoll] = useState<number>(0);
  const [comments, setComments] = useState<commentType[]>([]);
  const [replies, setReplies] = useState<commentType[]>([]);
  // const [post, setPost] = useState({ board: {} } as BoardPost);
  const [post, setPost] = useState({ board: preRender } as BoardPost);
  const [body, setBody] = useState("");
  const [replyBody, setReplyBody] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(0);
  const [checkList, setCheckList] = useState<string[]>([]);
  const [parent_id, setParentId] = useState<number>(0);
  const [checked, setChecked] = useState<boolean>(false);
  const [likeCnt, setLikeCnt] = useState<number>(0);
  const [reportModal, setReportModal] = useState(false);
  const [reportCommentModal, setReportCommentModal] = useState(false);
  const [reportType, setReportType] = React.useState<ReportType[]>([]);
  const [commentId, setCommentId] = useState<number>(0);
  const user = useSelector(UserStorage.userProfileSelector)! as UserData;
  const navigation = useNavigation<NavigationProps>();
  const [commentLength, setCommentLength] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [LoadingOverlay, setLoadingOverlay] = useState(false);
  const [pollOptionId, setPollOptionId] = useState<number>(0);

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

  const handleDelete = async () => {
    try {
      const response = await boardDelete(id);
      handlePollDelete();
      navigation.goBack();

      console.log(response);
    } catch (error) {
      alert(error);
    }
  };
  // console.log(boardData)
  const handleUpdate = () => {
    navigation.navigate("editPost", { post: post });
  };

  const handlePollDelete = () => {
    deletePoll(id).then(data => {
      console.log("투표", data);
    });
  };
  const handlePoll = async () => {
    try {
      const response = await doPoll(id, pollOptionId);
      console.log(response);
    } catch (error) {
      alert(error);
    }
  };

  const handlecommentInsert = async () => {
    try {
      const response = await commentInsert(id, body, isAnonymous);
      console.log(response);
      setBody("");
      setIsAnonymous(0);
      setCommentLength(commentLength + 1);
      Keyboard.dismiss();
    } catch (error) {
      console.log("댓글 작성 오류", error);
    }
  };

  const handleCommentDelete = async (id: number) => {
    try {
      const response = await commentDelete(id);
      console.log(response);
      setCommentLength(commentLength - 1);
    } catch (error) {
      console.log("댓글 삭제 오류", error);
    }
  };

  const handleReplyInput = async (parent_id: number, body: string) => {
    try {
      const response = await commentReply(parent_id, id, body, isAnonymous);
      console.log(response);
      setCommentLength(commentLength + 1);
      setReplyBody("");
      setIsAnonymous(0);
    } catch (error) {
      console.log("대댓글 오류", error);
    }
  };

  const check = (name: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckList([...checkList, name]);
    } else {
      setCheckList(checkList.filter(choice => choice !== name));
    }
  };

  useEffect(() => {
    getArticle(id)
      .then(data => {
        setPost(data.data as BoardPost);
        // console.error(data.data);
      })
      .catch();
  }, []);
  useEffect(() => {
    commentArticle(id, 1, 50)
      .then(response => {
        setComments(response.data.list as commentType[]);
        setCommentLength(comments.length);
        console.log(response.data.list);
        setReplies(comments.filter(comment => comment.parent_id > 0));
      })
      .catch();
  }, [likeCnt, commentLength, comments.length]);

  useEffect(() => {
    listReportType()
      .then(data => {
        setReportType(data.data as ReportType[]);
        console.log(data.data);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    getArticle(id)
      .then(data => {
        setPost(data.data as BoardPost);
        console.error(data.data);
      })
      .catch();
  }, []);

  // useEffect(() => {
  //   pollStatus(poll_id)
  //     .then(data => {
  //       setPoll(data.data as );
  //       console.error(data.data);
  //     })
  //     .catch();
  // }, []);

  useEffect(() => {
    getPollId(id)
      .then(response => {
        const poll_id = response.data.poll_id;
        setPoll(poll_id);
        pollStatus(poll_id);
      })
      .catch();
  }, []);

  // useEffect(() => {
  //   pollStatus(poll_id)
  //     .then
  // })

  const handleCommentLike = (comment_id: number, likeCnt: number) => {
    commentLike(user.id, comment_id)
      .then(res => {
        console.log(res.data);
        setLikeCnt(likeCnt);
      })
      .catch();
  };

  function alert() {
    Alert.alert("삭제", "삭제하시겠습니까?", [
      {
        text: "네",
        onPress: () => {
          handleDelete();
        },
      },
      {
        text: "아니오",
        style: "cancel",
      },
    ]);
  }
  function alertComment(id: number) {
    Alert.alert("삭제", "삭제하시겠습니까?", [
      {
        text: "네",
        onPress: () => {
          handleCommentDelete(id);
        },
      },
      {
        text: "아니오",
        style: "cancel",
      },
    ]);
  }

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

  const handleCommentReport = async (commentId: number, reportId: number) => {
    try {
      const response = await ReportComment(commentId, reportId);
      Alert.alert("신고되었습니다.");
      console.log(response);
    } catch (error) {
      Alert.alert(error);
    }
  };
  if (post.board === undefined) {
    return <></>;
  }

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

  const ModalWrapper = () => {
    const [selectedReportIndex, setSelectedReportIndex] = useState<number>();

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
                    handleReport(id, selectedReportIndex);
                    console.log(selectedReportIndex);
                  }
                  setReportModal(false);
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
  console.log(post.board);

  const profileNavi = () => {
    navigation.navigate("Profile");
  };

  const ModalWrapperComment = ({ commentId }: { commentId: number }) => {
    const [selectedCommentReportIndex, setSelectedCommentReportIndex] = useState<number>();

    return (
      <Modal animationType="fade" transparent={true} visible={reportCommentModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {reportType.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedCommentReportIndex(index); // 댓글 신고의 경우
                }}
                style={[
                  styles.reportItem,
                  selectedCommentReportIndex === index && styles.selectedReportItem,
                  // 선택된 항목의 경우 스타일 적용
                ]}
              >
                <Text style={styles.reportContent}>{item.name}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalBtnDirection}>
              <TextButton
                style={styles.modalConfirmBtn}
                onPress={() => setReportCommentModal(false)}
              >
                취소
              </TextButton>
              <TextButton
                style={styles.modalConfirmBtn}
                onPress={() => {
                  // 수정된 닉네임 server 전송
                  if (selectedCommentReportIndex !== null) {
                    handleCommentReport(commentId, selectedCommentReportIndex);
                    console.log(selectedCommentReportIndex);
                    console.log(commentId);
                  }
                  setReportCommentModal(false);
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
  return (
    <>
      <ScrollView style={styles.scroll}>
        <Container style={styles.container}>
          <ModalWrapper />
          <View style={styles.infoBox}>
            <View>
              <View style={styles.header}>
                <View>
                  <View>
                    <Text style={styles.nickname}>{post.board.userId}</Text>
                  </View>
                  <View>
                    <Text style={styles.date}>{dateTimeFormat(post.board.createdAt)}</Text>
                  </View>
                </View>
                {post.board.isMyBoard && (
                  <View style={styles.buttonBox}>
                    <TextButton
                      fontColor={"#000"}
                      style={styles.button}
                      fontSize={13}
                      onPress={handleUpdate}
                    >
                      수정
                    </TextButton>
                    <TextButton
                      fontColor={"#000"}
                      style={styles.button}
                      fontSize={13}
                      onPress={alert}
                    >
                      삭제
                    </TextButton>
                  </View>
                )}
              </View>
              <View style={styles.contextBox}>
                <View>
                  <Text style={styles.title}>{post.board.title}</Text>
                </View>
                <View>
                  <Text style={styles.context}>{post.board.body}</Text>
                  {post.board.imagesUrl != null && (
                    <ScrollView horizontal={true} style={styles.imageContainer}>
                      {post.board.imagesUrl.map((imageUrl, index) => (
                        <Image
                          key={index}
                          source={{ uri: imageUrl }}
                          style={{ width: 200, height: 200, marginRight: 5 }}
                        />
                      ))}
                    </ScrollView>
                  )}
                </View>
                {/* {post.board.pollInfo.state !== 2 && (
                  <View style={{ flex: 1, padding: 20, borderWidth: 1 }}>
                    <View>
                      <Text style={styles.title}>{post.board.pollInfo.title}</Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: "gray",
                        padding: 5,
                        marginVertical: 3,
                      }}
                    >
                      {post.board.pollInfo.pollOptions.map(options => (
                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            borderColor: pollOptionId === options.optionId ? "#87b8f1" : "gray",
                            padding: 10,
                            marginVertical: 3,
                            backgroundColor:
                              pollOptionId === options.optionId ? "#f0f6fd" : "white",
                          }}
                          key={options.optionId}
                          onPress={() => setPollOptionId(options.optionId)}
                        >
                          <Text>{options.optionName}</Text>
                        </TouchableOpacity>
                      ))}
                      <TextButton
                        fontColor={"#000"}
                        style={styles.button}
                        fontSize={13}
                        onPress={handlePoll}
                      >
                        투표하기
                      </TextButton>
                    </View>
                  </View>
                )} */}
                <View>
                  {post.board.tags != null && (
                    <ScrollView horizontal={true} style={styles.imageContainer}>
                      {post.board.tags.map((hash, index) => (
                        <Text key={index}>
                          <Text style={{ backgroundColor: "#C9E4F9" }}>{"#" + hash.name}</Text>
                          {"   "}
                        </Text>
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
          {/* 본문 */}
          {comments
            .filter(comment => comment.parent_id === null)
            .map(comment => (
              <>
                <View style={styles.commentBox} key={comment.id}>
                  <ModalWrapperComment commentId={commentId} />
                  <View style={styles.line} />
                  <View style={{ flex: 1, margin: "3%" }}>
                    <View style={styles.commentHeader}>
                      <View
                        style={{
                          flexDirection: "row",
                          paddingHorizontal: 15,
                          justifyContent: "flex-start",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            profileNavi();
                          }}
                        >
                          <Text style={styles.commentName}>{comment.nickname}</Text>
                        </TouchableOpacity>
                        <Text style={styles.commentDate}>{dateFormat(comment.created_at)}</Text>
                      </View>

                      <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <TextButton
                          style={styles.button}
                          fontSize={13}
                          fontColor={"#000"}
                          onPress={() => {
                            alertComment(comment.id);
                          }}
                        >
                          삭제
                        </TextButton>
                      </View>
                    </View>
                    <View style={{ paddingHorizontal: 10 }}>
                      <View style={styles.commentContext}>
                        <Text style={styles.context}>{comment.body}</Text>
                      </View>
                      <View style={styles.cbutBox}>
                        <IconButton
                          name="comment"
                          color="skyblue"
                          onPress={() => {
                            setParentId(comment.id);
                            setChecked(!checked);
                          }}
                        >
                          대댓글
                        </IconButton>
                        <IconButton
                          name="thumbs-o-up"
                          color="skyblue"
                          onPress={() => {
                            handleCommentLike(comment.id, comment.like_cnt);
                          }}
                        >
                          {comment.like_cnt === 0 ? "추천" : comment.like_cnt}
                        </IconButton>
                        <IconButton
                          name="exclamation-circle"
                          color="red"
                          onPress={() => {
                            setCommentId(comment.id);
                            setReportCommentModal(true);
                          }}
                        >
                          신고
                        </IconButton>
                      </View>
                    </View>

                    {/* 대댓글 */}
                    {replies
                      .filter(reply => reply.parent_id === comment.id)
                      .map(reply => (
                        <>
                          {/* <View style={styles.commentBox}> */}
                          <View style={styles.replyBox} key={reply.id}>
                            <View style={styles.line} />
                            <View style={{ margin: "2%" }}>
                              <View style={styles.commentHeader}>
                                <View style={{ flexDirection: "column" }}>
                                  <Text style={styles.commentName}>{reply.nickname}</Text>
                                  <Text style={styles.commentDate}>
                                    {dateFormat(reply.created_at)}
                                  </Text>
                                </View>
                                <View style={styles.cbutBox}>
                                  <IconButton
                                    name="thumbs-o-up"
                                    color="skyblue"
                                    onPress={() => {
                                      handleCommentLike(reply.id, reply.like_cnt);
                                    }}
                                  >
                                    {reply.like_cnt === 0 ? "추천" : reply.like_cnt}
                                  </IconButton>
                                  <IconButton
                                    name="exclamation-circle"
                                    color="red"
                                    onPress={() => {
                                      setCommentId(reply.id);
                                      setReportCommentModal(true);
                                    }}
                                  >
                                    신고
                                  </IconButton>
                                  <IconButton
                                    name=""
                                    color="red"
                                    onPress={() => handleCommentDelete(reply.id)}
                                  >
                                    삭제
                                  </IconButton>
                                </View>
                              </View>
                              <View style={styles.commentContext}>
                                <Text style={styles.context}>{reply.body}</Text>
                              </View>
                            </View>
                          </View>
                        </>
                      ))}
                  </View>
                </View>
              </>
            ))}
        </Container>
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ padding: 5, borderRadius: 5 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <Checkbox
            style={{ marginRight: 5 }}
            value={checkList.includes("anonymous")}
            onValueChange={isChecked => {
              check("anonymous", isChecked);
              setIsAnonymous(isChecked ? 1 : 0);
            }}
          ></Checkbox>
          <Text>익명</Text>
          <Input
            style={{
              flex: 1,
              backgroundColor: "white",
              paddingVertical: 15,
              paddingHorizontal: 12,
              marginRight: 5,
            }}
            placeholder={checked ? "대댓글을 작성해 주세요 ..." : "댓글을 작성해 주세요 ..."}
            value={checked ? replyBody : body}
            onChangeText={checked ? setReplyBody : setBody}
          ></Input>
          <TextButton
            onPress={() => {
              checked ? handleReplyInput(parent_id, replyBody) : handlecommentInsert();
            }}
          >
            작성
          </TextButton>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "white",
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
  infoBox: {
    justifyContent: "space-between",
    flex: 5,
    padding: "4%",
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  buttonBox: {
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
  contextBox: {
    margin: "5%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  context: {
    marginTop: 10,
    marginLeft: 5,
    fontSize: 17,
  },
  button: {
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 11,
    marginHorizontal: 4,
    backgroundColor: "#f2f2f2",
  },

  cbutBox: {
    flexDirection: "row",
  },
  commentBox: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#f2f2f2",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "center",
  },
  commentName: {
    fontSize: 15,
    marginRight: 5,
  },
  commentDate: {
    marginTop: 5,
    fontSize: 11,
    color: "lightgray",
    // marginLeft: 10,
  },
  commentContext: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  // touchdetail: {
  //   margin: "3%",
  // },
  scroll: {
    height: "30%",
  },
  replyBox: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    maxHeight: 180,
    overflow: "hidden",
    margin: 20,
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

export default BoardDetail;
