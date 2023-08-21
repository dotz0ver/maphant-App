import { useNavigation, useRoute } from "@react-navigation/native";
import { useDebugValue, useEffect, useState } from "react";
import { Text, View, FlatList, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { writeContentList } from "../../Api/member/Others";
import { Container } from "../../components/common";
import { OtherUserId, OWriteContentList } from "../../types/User";
import getCurrentTime from "../Time";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { NavigationProps } from "../../Navigator/Routes";

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
        renderItem={({ item, index }) => (
          <>
            <Pressable
              style={{ flex: 1, padding: 5, backgroundColor: "#fff" }}
              key={item.id}
              onPress={() => {
                console.log(item.board_id);
                navigation.navigate("BoradDetail", { id: item.board_id });
              }}
            >
              <Container
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <View>
                  <Text style={{ color: "gray" }}>{item.board_type}</Text>
                </View>
                <Container>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.board_title}</Text>
                </Container>
                <Container>
                  <Text style={{ fontSize: 12 }}>내 댓글 :{item.body}</Text>
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
                    <Text style={{ fontSize: 10 }}> &#9;{item.like_cnt}</Text>
                  </Container>
                  <Container>
                    <Text>{getCurrentTime(new Date(item.created_at))}</Text>
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
