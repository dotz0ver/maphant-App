import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { writeContentList } from "../../Api/member/Others";
import { Container, TextThemed } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";
import { OtherUserId, OWriteContentList } from "../../types/User";
import getCurrentTime from "../Time";

const WriteContent: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();

  const params = route.params as OtherUserId;
  const [contentList, setContentList] = useState<OWriteContentList[]>([]);
  useEffect(() => {
    writeContentList(params.id)
      .then(res => {
        setContentList(res.data.list);
      })
      .catch(e => console.error(e));
  }, []);
  return (
    <View style={{ display: "flex", flex: 1 }}>
      <FlatList
        data={contentList}
        renderItem={({ item }) => (
          <>
            <Pressable
              style={{ flex: 1, padding: 5 }}
              key={item.id}
              onPress={() => {
                navigation.navigate("BoradDetail", { id: item.board_id });
              }}
            >
              <Container
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <View>
                  <TextThemed style={{ color: "gray" }}>{item.board_type}</TextThemed>
                </View>
                <Container>
                  <TextThemed style={{ fontSize: 15, fontWeight: "bold" }}>
                    {item.board_title}
                  </TextThemed>
                </Container>
                <Container>
                  <TextThemed style={{ fontSize: 12 }}>내 댓글 :{item.body}</TextThemed>
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
                    <TextThemed style={{ fontSize: 10 }}> &#9;{item.like_cnt}</TextThemed>
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
      />
    </View>
  );
};

export default WriteContent;
