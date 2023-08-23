import { Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { GetAPI } from "../../Api/fetchAPI";
import { TextThemed } from "../../components/common";
import { BoardArticle } from "../../types/Board";

export default function (): JSX.Element {
  switch (0) {
    default:
      return Mylike();
  }
}

function Mylike(): JSX.Element {
  const [likes, setLikes] = React.useState<BoardArticle[]>([]);
  const [endPage, setEndPage] = React.useState<number>(0);
  const [pages, setPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const navigation = useNavigation();
  const recordSize: number = 10;
  useEffect(() => {
    GetAPI(`/profile/like?page=${pages}&recordSize=${recordSize}`).then(res => {
      if (res.success === false) {
        console.log(res.errors);
        return;
      } else {
        setLikes([...likes, ...res.data.list]);
        setEndPage(res.data.pagination.endPage);
      }
    });
  }, [pages]);

  const loadMorelikes = async () => {
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
      loadMorelikes();
    }
  }

  const detailContent = (likes: BoardArticle) => {
    navigation.navigate("BoardDetail", { id: likes.id });
  };

  return (
    <>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        {likes.map(like => (
          <>
            <Pressable onPress={() => detailContent(like)}>
              <View style={styles.container}>
                <View style={styles.head}>
                  <TextThemed>{like.type}</TextThemed>
                </View>
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <View>
                    <TextThemed style={styles.title}>{like.title}</TextThemed>
                  </View>
                </View>

                <View style={styles.head}>
                  <Feather name="thumbs-up" size={13} color="tomato" />
                  <TextThemed style={styles.good}>&#9; {like.like_cnt}</TextThemed>
                  <View style={{ flex: 1 }}></View>
                  <FontAwesome name="comment-o" size={13} color="blue" />
                  <TextThemed style={styles.comment}>&#9; {like.comment_cnt}</TextThemed>
                  <TextThemed style={{ justifyContent: "flex-end", fontSize: 10 }}></TextThemed>
                  <TextThemed style={styles.time}>{dateToString(like.created_at)}</TextThemed>
                </View>
              </View>
            </Pressable>
            <View style={{ borderBottomWidth: 1, borderColor: "#e8eaec", height: 0 }}></View>
          </>
        ))}
        {(isLoading || isComplete) && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {isLoading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              ) : (
                "이전 글이 없습니다."
              )}
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

function dateToString(date: string): string {
  const start = new Date(date);
  const end = new Date();

  const diff = end.getTime() - start.getTime();
  const diffDate = new Date(diff);

  const year = diffDate.getFullYear() - 1970;
  const month = diffDate.getMonth();
  const day = diffDate.getDate() - 1;
  const hour = diffDate.getHours();
  const minute = diffDate.getMinutes();
  const second = diffDate.getSeconds();

  if (year > 0) return `${year}년 전`;
  if (month > 0) return `${month}달 전`;
  if (day > 0) return `${day}일 전`;
  if (hour > 0) return `${hour}시간 전`;
  if (minute > 0) return `${minute}분 전`;
  if (second > 0) return `${second}초 전`;
  return "방금 전";
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
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    justifyContent: "flex-start",
    fontWeight: "bold",
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
