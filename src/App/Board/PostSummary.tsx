import { Feather, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { BoardArticle, BoardType, HotBoard } from "../../types/Board";
import { TextThemed } from "../../components/common";

export default function ({
  post,
  boardType,
}: {
  post: BoardArticle | HotBoard;
  boardType: BoardType;
}): JSX.Element {
  switch (boardType) {
    default:
      return PostSummary(post);
  }
}

function PostSummary(post: BoardArticle | HotBoard): JSX.Element {
  return (
    <>
      <View style={styles.head}>
        <TextThemed style={styles.title}>{post.title}</TextThemed>
        <TextThemed style={styles.userName}>{post.userNickname}</TextThemed>
      </View>
      <View>
        <TextThemed style={styles.content} numberOfLines={1}>
          {post.body}
        </TextThemed>
      </View>
      <View style={styles.head}>
        {post.likeCnt > 0 ? (
          <>
            <Feather name="thumbs-up" size={13} color="tomato" />
            <TextThemed style={styles.good}>&#9; {post.likeCnt}</TextThemed>
          </>
        ) : post.commentCnt == 0 ? (
          <View style={{ flex: 1 }}></View>
        ) : null}
        {post.commentCnt > 0 ? (
          <>
            <FontAwesome name="comment-o" size={13} color="blue" />
            <TextThemed style={styles.comment}>&#9; {post.commentCnt}</TextThemed>
          </>
        ) : null}
        <TextThemed style={{ justifyContent: "flex-end", fontSize: 10 }}>
          {dateToString(post.createdAt)}
        </TextThemed>
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    margintop: 10,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    justifyContent: "flex-start",
    fontWeight: "bold",
  },
  board: {
    fontSize: 10,
    color: "gray",
  },
  userName: {
    fontSize: 10,
    color: "gray",
  },
  content: {
    fontSize: 15,
    marginVertical: 5,
    marginRight: "50%",
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
});
