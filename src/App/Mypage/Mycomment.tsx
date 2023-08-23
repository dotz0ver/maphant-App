import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { GetAPI } from "../../Api/fetchAPI";
import { TextThemed } from "../../components/common";
import UserStorage from "../../storage/UserStorage";
import { BoardArticle } from "../../types/Board";
import { formatTimeDifference } from "../../utils/Time";

export default function (): JSX.Element {
  switch (0) {
    default:
      return Mycomment();
  }
}

function Mycomment(): JSX.Element {
  const [comments, setComments] = useState<BoardArticle[] & { body: string }[]>([]);
  const [endPage, setEndPage] = React.useState<number>(0);
  const [pages, setPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const navigation = useNavigation();

  const recordSize: number = 10;
  const userID: number = useSelector(UserStorage.userProfileSelector)!.id;

  useEffect(() => {
    GetAPI(`/profile/comment?page=${pages}&recordSize=${recordSize}&targetUserId=${userID}`).then(
      res => {
        if (res.success === false) {
          console.log(res.errors);
          return;
        } else {
          setComments([...comments, ...res.data.list]);
          setEndPage(res.data.pagination.endPage);
        }
      },
    );
  }, [pages]);

  const loadMorecomments = async () => {
    if (!isLoading) {
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 2000));

      if (pages === endPage) {
        setIsComplete(true);
      } else if (pages < endPage) {
        setPages(pages + 1);
      }
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleScroll(event: any) {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    if (offsetY + scrollViewHeight >= contentHeight - 20) {
      loadMorecomments();
    }
  }

  const detailContent = (comments: BoardArticle) => {
    navigation.navigate("BoardDetail", { id: comments.board_id });
  };

  return (
    <>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        {comments.map(comment => (
          <>
            <Pressable onPress={() => detailContent(comment)}>
              <View style={styles.container}>
                <View style={styles.head}>
                  <View style={{ marginRight: 20 }}>
                    <TextThemed>{comment.board_type}</TextThemed>
                  </View>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <View>
                    <TextThemed style={styles.title}>{comment.board_title}</TextThemed>
                  </View>
                </View>
                <View
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <View>
                    <TextThemed style={styles.comment}>내 댓글 : {comment.body}</TextThemed>
                  </View>
                </View>

                <View style={styles.head}>
                  <Feather name="thumbs-up" size={13} color="tomato" />
                  <TextThemed style={styles.good}>&#9; {comment.like_cnt}</TextThemed>
                  <View style={{ flex: 1 }}></View>
                  {/* <FontAwesome name="comment-o" size={13} color="blue" />
                  <Text style={styles.comment}>&#9; {comments.comment_cnt}</Text> */}
                  <TextThemed style={{ justifyContent: "flex-end", fontSize: 10 }}></TextThemed>
                  <TextThemed style={styles.time}>
                    {formatTimeDifference(new Date(comment.created_at))}
                  </TextThemed>
                </View>
              </View>
            </Pressable>
            <View style={{ borderBottomWidth: 1, borderColor: "#e8eaec", height: 0 }}></View>
          </>
        ))}
        {(isLoading || isComplete) && (
          <View style={styles.loadingContainer}>
            <TextThemed style={styles.loadingText}>
              {isLoading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <ActivityIndicator size="large" color="rgba(82, 153, 235,0.7)" />
                </View>
              ) : (
                "이전 댓글이 없습니다."
              )}
            </TextThemed>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    margintop: 10,
  },
  head: {
    flexDirection: "row",
  },
  title: {
    fontSize: 15,
    justifyContent: "flex-start",
    fontWeight: "bold",
  },
  comment: {
    fontSize: 10,
    justifyContent: "flex-start",
  },
  board: {
    fontSize: 10,
    color: "gray",
  },
  content: {
    fontSize: 15,
    marginVertical: 5,
    marginRight: "50%",
  },
  time: {
    alignItems: "flex-end",
  },
  bottom: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  good: {
    flex: 1,
    fontSize: 10,
    justifyContent: "flex-start",
  },
  comment: {
    flex: 9,
    fontSize: 10,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  loadingText: {
    fontSize: 16,
    color: "gray",
  },
});
