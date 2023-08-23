import { Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { GetAPI } from "../../Api/fetchAPI";
import { BoardArticle } from "../../types/Board";
import { formatTimeDifference } from "../../utils/Time";

export default function (): JSX.Element {
  switch (0) {
    default:
      return Bookmark();
  }
}

function Bookmark(): JSX.Element {
  const [bookmark, setBookmark] = useState<BoardArticle[]>([]);
  const [isSetting, setIsSetting] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [endPage, setEndPage] = React.useState<number>(0);
  const [pages, setPages] = useState<number>(1);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const recordSize: number = 10;
  const pageSize: number = 20;
  const navigation = useNavigation();

  const extractBoardIds = () => {
    return GetAPI(`/bookmark/my-list?page=${pages}&recordSize=${recordSize}&pageSize=${pageSize}`)
      .then(res => {
        setEndPage(res.data.pagination.endPage);
        return res;
      })
      .then(res => {
        if (res.success === false) {
          console.log(res.errors);
          return;
        } else {
          const boardIds = res.data.list.map(item => item.boardId);
          return Promise.resolve({ boardIds, endPage: res.data.pagination.endPage });
        }
      });
  };

  useEffect(() => {
    extractBoardIds().then(async props => {
      const { boardIds, endPage } = props;

      const bookmarks: BoardArticle[] = [];
      for (let i = boardIds.length - 1; i >= 0; i--) {
        await GetAPI(`/board/${boardIds[i]}/`).then(res => {
          if (res.success === false) {
            console.log(res.errors);
            return;
          } else {
            bookmarks.push(res.data.board);
          }
        });
      }
      setBookmark([...bookmark, ...bookmarks]);
      setIsSetting(false);
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

  const detailContent = (boards: BoardArticle) => {
    navigation.navigate("BoardDetail", { id: boards.id });
  };

  return (
    <>
      {isSetting ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
          {bookmark.map(bookmark => (
            <>
              <Pressable key={bookmark.id} onPress={() => detailContent(bookmark)}>
                <View style={styles.container}>
                  <View style={styles.head}>
                    <Text>
                      {(() => {
                        switch (bookmark.typeId) {
                          case 1:
                            return "자유 게시판";
                          case 2:
                            return "질문 게시판";
                          case 3:
                            return "지식 게시판";
                          case 4:
                            return "취업/진로 게시판";
                          case 5:
                            return "홍보 게시판";
                          case 6:
                            return "취미 게시판";
                          default:
                            return "알 수 없는 게시판 유형";
                        }
                      })()}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  >
                    <View>
                      <Text style={styles.title}>{bookmark.title}</Text>
                    </View>
                  </View>

                  <View style={styles.head}>
                    <Feather name="thumbs-up" size={13} color="tomato" />
                    <Text style={styles.good}>&#9; {bookmark.likeCnt}</Text>
                    <View style={{ flex: 1 }}></View>
                    <FontAwesome name="comment-o" size={13} color="blue" />
                    <Text style={styles.comment}>&#9; {bookmark.commentCnt}</Text>
                    <Text style={{ justifyContent: "flex-end", fontSize: 10 }}></Text>
                    <Text style={styles.time}>
                      {formatTimeDifference(new Date(bookmark.createdAt))}
                    </Text>
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
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
