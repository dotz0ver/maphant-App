//이미지 색만 바뀨기
import { StackActions, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

import { chartLists, sendContent } from "../../Api/member/FindUser";
import { Container, ImageBox, Input, TextButton, TextThemed } from "../../components/common";
import { MailFormParams } from "../../Navigator/MailRoute";
import { NavigationProps } from "../../Navigator/Routes";
import { ReceiveList } from "../../types/DM";
const Chatroom: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const params = route.params as MailFormParams;

  const [receiveContent, setReceiveContent] = useState<ReceiveList[]>([]);
  const [content, setContent] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [flag, setFlag] = useState<boolean>(false);
  const handleEndReached = () => {
    setFlag(true);
    fetchChatLists(params.roomId);
  };
  const fetchChatLists = (roomId: number) => {
    chartLists(roomId, page)
      .then(res => {
        if (res.success) {
          const receive = res.data?.list;
          setReceiveContent(receiveContent => [...receiveContent, ...receive]);
          setPage(res.data?.nextCursor);
          setFlag(false);
        }
      })
      .catch(e => {
        if (page !== null) console.error("fetchChatLists에러", e);
      });
  };
  const send = async () => {
    await sendContent(params.id, content)
      .then(res => {
        if (res.success) {
          if (params.roomId === 0) {
            params.roomId = res.data?.room_id;
          }
          fetchChatLists(params.roomId);
        }
      })
      .catch(e => console.error("send에러", e));
    setContent("");
  };

  useEffect(() => {
    if (params.roomId) fetchChatLists(params.roomId);
  }, [params.roomId]);

  useEffect(() => {
    // 업데이트 후 화면을 다시 렌더링합니다.
    console.error("시발 안된다고 ㅅㅂ");
  }, [receiveContent]);

  console.log(receiveContent);

  function getCurrentTime(targetDate: Date) {
    const hours = targetDate.getHours();
    const minutes = targetDate.getMinutes();

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const currentTime = `${formattedHours}:${formattedMinutes}`;
    return currentTime;
  }

  function OtherUserChat({ item }: { item: ReceiveList }) {
    return (
      <Container style={{ paddingVertical: 0 }}>
        <Container style={{ padding: 10 }}>
          <TextThemed>{params.nickname}</TextThemed>
          <Container style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Container
              style={{
                backgroundColor: "rgba(82, 153, 235, 0.45)",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 15,
                paddingBottom: 15,
                paddingHorizontal: 20,
                borderRadius: 10,
                flexShrink: 1,
              }}
            >
              <TextThemed>{item.content}</TextThemed>
            </Container>
            <TextThemed style={{ marginLeft: 5 }}>{getCurrentTime(new Date(item.time))}</TextThemed>
          </Container>
        </Container>
      </Container>
    );
  }
  function UserChat({ item }: { item: ReceiveList }) {
    return (
      <Container style={{ paddingVertical: 0 }}>
        <Container style={{ padding: 10, alignItems: "flex-end" }}>
          <Container style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <TextThemed style={{ marginRight: 5 }}>
              {getCurrentTime(new Date(item.time))}
            </TextThemed>
            <Container
              style={{
                backgroundColor: "#5299EB",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 15,
                paddingBottom: 15,
                paddingHorizontal: 20,
                borderRadius: 10,
                flexShrink: 1,
              }}
            >
              <Text style={{ color: "white" }}>{item.content}</Text>
            </Container>
          </Container>
        </Container>
      </Container>
    );
  }
  const renderItem = ({ item }: { item: ReceiveList }) => {
    if (item.time && item.is_me) {
      return <UserChat item={item} />;
    } else {
      return <OtherUserChat item={item} />;
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
    >
      <Container isFullScreen={true} style={{ flex: 1, display: "flex" }}>
        <Container
          style={{
            flex: 0.7,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity onPress={() => navigation.dispatch(StackActions.popToTop())}>
            <ImageBox source={require("../../../assets/arrow-circle.png")} width={35}></ImageBox>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Profile", { id: params.id } as never);
            }}
          >
            <TextThemed style={{ fontSize: 23, fontWeight: "bold", marginLeft: 20 }}>
              {params.nickname}
            </TextThemed>
          </TouchableOpacity>
        </Container>
        {flag && receiveContent.length > 20 && page != null ? (
          <ActivityIndicator size="small" color="black" />
        ) : null}
        <Container style={{ flex: 10 }}>
          <FlatList
            data={receiveContent}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            inverted={true}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
          />
        </Container>
        <Container
          paddingHorizontal={0}
          style={{
            flex: 1,
            flexDirection: "row",
            padding: "3%",
            marginBottom: 90,
          }}
        >
          <Input
            multiline={true}
            style={{ maxHeight: 100, flexShrink: 1, flex: 6 }}
            placeholder="message"
            value={content}
            onChangeText={setContent}
          />
          <TextButton
            onPress={() => {
              send();
            }}
            style={{
              flex: 1,
              marginLeft: 10,
              paddingHorizontal: 10,
              paddingVertical: 0,
              borderRadius: 100,
              width: "100%",
              height: "100%",
            }}
          >
            전송
          </TextButton>
        </Container>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default Chatroom;
