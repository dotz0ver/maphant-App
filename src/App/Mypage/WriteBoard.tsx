import { Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { bringBoardList } from "../../Api/member/Others";
import { Container, TextThemed } from "../../components/common";
import { OtherUserForm } from "../../Navigator/MypageRoute";
import { NavigationProps } from "../../Navigator/Routes";
import { OWriteBoardList, Pagination } from "../../types/User";
import getCurrentTime from "../Time";
const WriteBoard: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const params = route.params as OtherUserForm;
  const [writeboardList, setWriteBoardList] = useState<OWriteBoardList[]>([]);
  const [page, setPage] = useState<Pagination[]>([]);
  useEffect(() => {
    bringBoardList(params.id)
      .then(res => {
        setWriteBoardList(res.data.list);
        setPage(res.data.pagination);
      })
      .catch(e => Alert.alert(e));
  }, []);

  return (
    <View style={{ display: "flex", flex: 1 }}>
      <View style={{ padding: 10 }}>
        <TextThemed style={{ fontWeight: "bold" }}>
          Total page : {page.totalRecordCount}{" "}
        </TextThemed>
      </View>
      <FlatList
        style={{ marginTop: 3 }}
        data={writeboardList}
        renderItem={({ item }) => (
          <>
            <Pressable
              style={{ flex: 1, padding: 5 }}
              key={item.id}
              onPress={() => {
                navigation.navigate("BoardDetail", { id: item.id });
              }}
            >
              <Container
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <View>
                  <TextThemed style={{ color: "gray" }}>{item.type}</TextThemed>
                </View>
                <Container>
                  <TextThemed style={{ fontSize: 16, fontWeight: "bold" }}>{item.title}</TextThemed>
                </Container>
                <Container>
                  <TextThemed style={{ fontSize: 13 }} numberOfLines={2}>
                    {item.body}
                  </TextThemed>
                </Container>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <Container style={{ flexDirection: "row" }}>
                    <Feather name="thumbs-up" size={13} color="tomato" />

                    <TextThemed style={{ fontSize: 10, marginRight: 10 }}>
                      {" "}
                      &#9;{item.like_cnt}
                    </TextThemed>

                    <FontAwesome name="comment-o" size={13} color="blue" />
                    <TextThemed style={{ fontSize: 10 }}> &#9;{item.comment_cnt}</TextThemed>
                  </Container>
                  <Container>
                    <TextThemed>{getCurrentTime(new Date(item.created_at))}</TextThemed>
                  </Container>
                </View>
              </Container>
            </Pressable>
            <View
              style={{
                width: "100%",
                height: 2,
                backgroundColor: "#e8eaec",
              }}
            />
          </>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default WriteBoard;
