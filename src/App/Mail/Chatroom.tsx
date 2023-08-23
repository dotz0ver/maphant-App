//이미지 색만 바뀨기
import { Ionicons } from "@expo/vector-icons";
import { StackActions, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

import { chartLists, sendContent } from "../../Api/member/FindUser";
import { Container, Input, TextButton, TextThemed } from "../../components/common";
import { MailFormParams } from "../../Navigator/MailRoute";
import { NavigationProps } from "../../Navigator/Routes";
import { ReceiveList } from "../../types/DM";
const Chatroom: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const params = route.params as MailFormParams;

  const [receiveContent, setReceiveContent] = useState<ReceiveList[]>([]);
  const [content, setContent] = useState<string>("");
  const isChatLoading = useRef<boolean>(false);
  const prevPage = useRef<number | null>(0);
  const [flag, setFlag] = useState<boolean>(false);

  const handleEndReached = () => {
    setFlag(true);
    fetchPrevChatLists(params.roomId);
  };
  const fetchPrevChatLists = (roomId: number) => {
    if (prevPage.current === null) return;

    if (isChatLoading.current) return;
    isChatLoading.current = true;

    chartLists(roomId, prevPage.current)
      .then(res => {
        if (res.success) {
          const receive = res.data?.list;
          const p = res.data?.nextCursor;
          setReceiveContent(receiveContent => [...receiveContent, ...receive]);
          prevPage.current = p;
          setFlag(false);
        }
      })
      .catch(e => {
        if (params.roomId != 0) console.error("fetchChatLists에러", e);
      })
      .finally(() => (isChatLoading.current = false));
  };

  const fetchNewChatLists = async (roomId: number) => {
    if (receiveContent.length == 0) return;

    const currentNewestId = receiveContent[0].id;
    let tmpNewChatList: ReceiveList[] = [];

    let newPage: number | null = 0;

    while (newPage == 0 || newPage > currentNewestId) {
      await chartLists(roomId, newPage).then(res => {
        const receive = res.data?.list;
        newPage = res.data?.nextCursor;

        tmpNewChatList = [...tmpNewChatList, ...receive];
      });

      if (newPage) break;
    }

    setReceiveContent([
      ...tmpNewChatList.filter(item => item.id > receiveContent[0].id),
      ...receiveContent,
    ]);
  };

  const send = async () => {
    await sendContent(params.id, content)
      .then(res => {
        if (res.success) {
          if (params.roomId === 0) {
            params.roomId = res.data?.room_id;
          }
        }

        fetchNewChatLists(params.roomId);
      })
      .catch(e => alert(e));
    setContent("");
  };

  useEffect(() => {
    if (params.roomId) fetchPrevChatLists(params.roomId);
  }, [params.roomId]);
  useEffect(() => {
    const interval = setInterval(() => fetchNewChatLists(params.roomId), 1000);

    return () => {
      clearInterval(interval);
    };
  });

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
      <Container isForceTopSafeArea={true} style={{ flex: 1, display: "flex", padding: 15 }}>
        <Container
          style={{
            flex: 0.7,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity onPress={() => navigation.dispatch(StackActions.popToTop())}>
            <Ionicons name="arrow-back" size={24} color="gray" />
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
        {flag && receiveContent.length > 20 ? (
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
            contentContainerStyle={{ paddingTop: 10 }}
          />
        </Container>
        <Container
          paddingHorizontal={0}
          style={{
            flex: 1,
            flexDirection: "row",
            marginBottom: 10,
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
