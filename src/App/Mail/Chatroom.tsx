import { StackActions, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text } from "react-native";
import { useWindowDimensions } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

import { chartLists, sendContent } from "../../Api/member/FindUser";
import { Container, ImageBox, Input, TextButton } from "../../components/common";
import { MailFormParams } from "../../Navigator/MailRoute";
import { NavigationProps } from "../../Navigator/Routes";
import { ReceiveList } from "../../types/DM";
const Chatroom: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const windowWidth = useWindowDimensions().width; // window 가로 길이s
  // SearchUser.tsx에서 입력한 유저의  id, nickname을 가져오기 위해 사용한 것
  const route = useRoute();
  const params = route.params as MailFormParams;
  const [receiveContent, setReceiveContent] = useState<ReceiveList[]>([]);
  const [content, setContent] = useState("");
  const fetchChatLists = async (roomId: number) => {
    //대화내용 받아오는거 같음
    chartLists(roomId) //그 대화내용의 방 id
      .then(res => {
        if (res.success) {
          setReceiveContent(res.data?.list);
          console.log("fetchChatLists 받아옴");
        }
      })
      .catch(e => console.error("fetchChatLists에러", e));
  };
  const send = async () => {
    // 전송 버튼 눌렸을때 실행되는 함수
    await sendContent(params.id, content) //postApi 로 id ,content 보냄
      .then(res => {
        //성공하면 return 시켜라
        if (res.success) {
          // 채팅방 처음 만들 때 방 아이디 찾아줌
          if (params.roomId === 0) params.roomId = res.data?.room_id;
          fetchChatLists(params.roomId);
        }
        // 메세지 보낼 때 채팅방 번호 알아서 이걸 넣어 줘야함
        console.log("send성공");
      })
      .catch(e => console.error("send에러", e));
    setContent("");
  };

  useEffect(() => {
    if (params.roomId) fetchChatLists(params.roomId);
  }, [params.roomId]);

  function getCurrentTime(targetDate: Date) {
    const hours = targetDate.getHours();
    const minutes = targetDate.getMinutes();
    // 00 : 00 분으로 표시되게 바꿈
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const currentTime = `${formattedHours}:${formattedMinutes}`;
    return currentTime;
  }

  function OtherUserChat({ item }: { item: ReceiveList }) {
    return (
      <Container style={{ paddingVertical: 0 }}>
        <Container style={{ padding: 10 }}>
          <Text>{params.nickname}</Text>
          <Container style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Container
              style={{
                backgroundColor: "rgba(82, 153, 235, 0.3)",
                paddingVertical: 13,
                paddingHorizontal: 20,
                borderRadius: 10,
                flexShrink: 1,
              }}
            >
              <Text>{item.content}</Text>
            </Container>
            <Text style={{ marginLeft: 5 }}>{getCurrentTime(new Date(item.time))}</Text>
          </Container>
        </Container>
      </Container>
    );
  }
  function UserChat({ item }: { item: ReceiveList }) {
    return (
      <Container style={{ paddingVertical: 0 }}>
        <Container style={{ padding: 10, alignItems: "flex-end" }}>
          <Text>ME</Text>
          <Container style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Text style={{ marginRight: 5 }}>{getCurrentTime(new Date(item.time))}</Text>
            <Container
              style={{
                backgroundColor: "#5299EB",
                paddingVertical: 13,
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
        <Container // 채팅방 이름
          style={{
            flex: 0.7,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            flexShrink: 1,
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
            <Text style={{ fontSize: 23, fontWeight: "bold", marginRight: windowWidth / 2 - 66 }}>
              {params.nickname}
            </Text>
          </TouchableOpacity>
        </Container>
        <Container style={{ flex: 10 }}>
          <FlatList
            data={receiveContent}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            inverted={true} //역순 스크롤 ㅜㅜ
            // ListHeaderComponent={}
          />
        </Container>
        <Container // 채팅입력창
          paddingHorizontal={0}
          style={{
            flex: 2, // 네비게이션 바 없어지면 1로 바꾸기
            flexDirection: "row",

            // paddingHorizontal: 10,
            padding: "3%",
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
              paddingHorizontal: 0,
              paddingVertical: 0,
              borderRadius: 300,
              width: "100%",
              height: "100%",
            }}
          >
            전송
          </TextButton>
          {/* </Container> */}
        </Container>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default Chatroom;
