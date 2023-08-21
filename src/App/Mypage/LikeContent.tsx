import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { likeBoardList } from "../../Api/member/Others";
import { Container } from "../../components/common";
import { OLikeContentList, OtherUserId } from "../../types/User";
import getCurrentTime from "../Time";

const LikeContent: React.FC = () => {
  const route = useRoute();
  const params = route.params as OtherUserId;
  const lineStyle = { width: "100%", height: 1.3, backgroundColor: "#5299EB" };

  const [likeList, setLikeList] = useState<OLikeContentList[]>([]);
  useEffect(() => {
    likeBoardList(params.id)
      .then(res => {
        setLikeList(res.data.list);
      })
      .catch(e => console.error(e));
  }, []);
  return (
    <Container style={{ backgroundColor: "white", display: "flex", flex: 1 }}>
      <Container style={{ alignItems: "center", flex: 0.1, justifyContent: "center" }}>
        <Text style={{ fontSize: 20, color: "#5299EB", fontWeight: "bold" }}>
          좋아요한 글 목록 페이지
        </Text>
      </Container>
      <Container style={{ flex: 1 }}>
        <View style={{ width: "100%", height: 2, backgroundColor: "#5299EB" }} />

        <FlatList
          data={likeList}
          renderItem={({ item, index }) => (
            <>
              {index >= 0 && <View style={lineStyle} />}
              <TouchableOpacity style={{ padding: 18 }} key={item.id}>
                <View style={{}}>
                  <Text style={{ fontSize: 17, fontWeight: "bold" }}>{item.title}</Text>
                  <Text style={{ marginTop: 10, fontSize: 15 }} numberOfLines={3}>
                    {item.body}
                  </Text>
                  <Text style={{ marginTop: 10, fontSize: 10, color: "gray" }}>
                    생성일 :{getCurrentTime(new Date(item.created_at))}
                  </Text>
                </View>
              </TouchableOpacity>
              {index === likeList.length - 1 && <View style={lineStyle} />}
            </>
          )}
          keyExtractor={item => item.id.toString()}
        />
      </Container>
    </Container>
  );
};

export default LikeContent;
