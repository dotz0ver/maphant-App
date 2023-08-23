import { Feather, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

import { TextThemed } from "../../components/common";
import { BoardArticle, BoardType, HotBoard } from "../../types/Board";
import { formatTimeDifference } from "../../utils/Time";

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
          {formatTimeDifference(new Date(post.createdAt))}
        </TextThemed>
      </View>
    </>
  );
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
