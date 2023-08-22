import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { receiveChatrooms } from "../../Api/member/FindUser";
import { readProfile } from "../../Api/member/Others";
import { Container, ImageBox, TextButton } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";
import { MessageList } from "../../types/DM";
import { OtherUserData, OtherUserId } from "../../types/User";

const Profile: React.FC = () => {
  const route = useRoute();
  const params = route.params as OtherUserId;
  const navigation = useNavigation<NavigationProps>();
  const [otherUserProfileList, setOtherUserProfileList] = useState<OtherUserData[]>([]);
  const [cmpid, setCmpId] = useState<MessageList[]>([]);
  useEffect(() => {
    // 불러온 id로 상대방 프로필, 소개글, 닉네임을 받아옴
    readProfile(params.id)
      .then(res => {
        setOtherUserProfileList(res.data as OtherUserData[]);
        console.log(res.data);
      })
      .catch(e => console.log(e));
    //채팅방 목록 불러오기
    receiveChatrooms()
      .then(res => {
        setCmpId(res.data);
      })
      .catch(e => console.error(e));
  }, []);

  const chat = () => {
    const roomIds = cmpid.filter(item => item.other_id == params.id);
    const roomId = roomIds.length == 0 ? 0 : roomIds[0].id;
    // 여기 상대방 닉네임이랑, 그 상대방의 id를 같이 넘겨줘야함. id는 board에서 상대 닉네임 클릭시 id랑 같이 넘겨 받아야함. MypageRoute에 추가해줘서 넘어감 이게 맞는 방법인지 잘모르겠음
    navigation.navigate("Chatroom", {
      id: params.id,
      nickname: otherUserProfileList[0]?.user_nickname,
      roomId: roomId,
    } as never);
  };
  const changePage = (item: string) => {
    if (item.toString() == "작성한 게시글 목록") {
      console.log(navigation.getState());
      navigation.navigate("WriteBoard", { id: params.id } as never);
    }
    if (item.toString() == "작성한 댓글 목록") {
      navigation.navigate("WriteContent", { id: params.id } as never);
    }
  };
  console.log("여기다", otherUserProfileList);

  function OtherProfile() {
    return (
      <Container
        style={{
          flex: 3,
          backgroundColor: "rgba(82, 153, 235, 0.3)",
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 1,
        }}
      >
        <Container style={{ flex: 2, justifyContent: "flex-end" }}>
          <ImageBox
            // 기본 이미지 설정 되면 나중에 변경해야함
            source={
              otherUserProfileList[0]?.profile_img
                ? { uri: otherUserProfileList[0]?.profile_img }
                : require("../../../assets/image3.jpg")
            }
            width={110}
            height={110}
            borderRadius={100}
            style={{ borderColor: "#5299EB", borderWidth: 3, borderRadius: 100 }}
          />
          <Container style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
              {otherUserProfileList[0]?.user_nickname}
            </Text>
          </Container>
        </Container>
        <Container style={{ alignItems: "center" }}>
          <Container style={{}}>
            {
              // 소개글 유무로 내용을 정함
              otherUserProfileList[0]?.body ? (
                <Text>{otherUserProfileList[0]?.body}</Text>
              ) : (
                <Text> 소개글을 남겨보세요!</Text>
              )
            }
            <View
              style={{
                borderBottomColor: "#5299EB",
                borderBottomWidth: 2,
                marginVertical: 5,
              }}
            />
          </Container>
          <Container>
            {otherUserProfileList.map((major, index) => (
              <Text key={index} style={{ color: "gray" }}>
                {major.major_name}
              </Text>
            ))}
          </Container>
        </Container>
        <Container style={{ flex: 1 }}>
          <TextButton
            onPress={() => {
              chat();
            }}
          >
            1:1채팅
          </TextButton>
        </Container>
      </Container>
    );
  }

  function Otherfunction() {
    return (
      <Container
        style={{
          backgroundColor: "rgba(82, 153, 235, 0.5)",
          borderRadius: 8,
          marginTop: 20,
          flex: 1,
        }}
      >
        <Container style={{ padding: 20 }}>
          <Container style={{ flexDirection: "row" }}>
            <FontAwesome name="user" color="#5299EB" size={18} />
            <Text style={{ fontWeight: "bold", fontSize: 16, marginLeft: 10 }}>계정 기능</Text>
          </Container>
          <Container style={{}}>
            {["작성한 게시글 목록", "작성한 댓글 목록"].map((item, index, array) => (
              <>
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    changePage(item);
                  }}
                  style={{
                    padding: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Container>
                    <Text style={{ fontWeight: "600" }}>{item}</Text>
                  </Container>
                  <Container>
                    <FontAwesome name="angle-right" color="#5299EB" />
                  </Container>
                </TouchableOpacity>
                {index !== array.length - 1 && (
                  <View style={{ width: "100%", height: 1, backgroundColor: "#5299EB" }} />
                )}
              </>
            ))}
          </Container>
        </Container>
      </Container>
    );
  }
  return (
    <SafeAreaView style={{ display: "flex", flex: 1, padding: 20, shadowColor: "black" }}>
      <OtherProfile />
      <Otherfunction />
    </SafeAreaView>
  );
};

export default Profile;
