import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { isEqual } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { deleteChat, receiveChatrooms } from "../../Api/member/FindUser";
import { Container, TextButton, TextThemed } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";
import { MessageList } from "../../types/DM";

const Mail: React.FC = () => {
  //is_read : 안 읽었을때 1 = true 읽었을 때 0 = false
  // sendDate 가 들어왔을 때 분전 , 시간 전으로 바꾸는 코드
  function formatTimeDifference(targetDate: Date): string {
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - targetDate.getTime();

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (seconds < 60) {
      return `${seconds}초 전`;
    } else if (minutes < 60) {
      return `${minutes}분 전`;
    } else if (hours < 24) {
      return `${hours}시간 전`;
    } else if (days < 30) {
      return `${days}일 전`;
    } else {
      return `${months}개월 전`;
    }
  }
  const [chatList, setChatList] = useState<MessageList[]>([]);
  const navigation = useNavigation<NavigationProps>();
  const del = (id: number) => {
    deleteChat(id);
  };
  const searchUser = () => {
    navigation.navigate("SearchUser" as never);
  };

  //useCallback을 사용하면 의존성이 변경되는 경우(chatList 변경되는 경우 인듯?), 이전에 기억하고 있던 함수 자체와 비교해서 다른 경우 리랜더
  // 원래 object 끼리 ==, === 연산자  결과는 무조건 false인데 useCallback을 사용하면 동등성을 보장할 수 있음
  const fetchChatRooms = useCallback(async () => {
    try {
      await receiveChatrooms().then(res => {
        if (res.success) {
          setChatList(res.data);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }, [chatList]);

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);
  return (
    <Container style={{ flex: 1 }}>
      <View style={styles.header}>
        <TextThemed style={styles.mailText}>쪽지함</TextThemed>
      </View>
      <ScrollView>
        <View style={styles.sender}>
          <View>
            <View
              style={{ borderBottomWidth: 1, borderColor: "rgba(232,234,236,0.5)", height: 0 }}
            ></View>
            {chatList.map(mail => (
              // eslint-disable-next-line react/jsx-key
              <>
                <TouchableOpacity
                  key={mail.id}
                  onPress={() => {
                    // console.log(mail.id);
                    // 채티방 페이지로 상대방 아이디랑, 닉네임 같이 넘김
                    navigation.navigate("Chatroom", {
                      id: mail.other_id,
                      nickname: mail.other_nickname,
                      roomId: parseInt(mail.id),
                    });
                  }}
                >
                  <View style={[styles.mail, mail.unread_count ? styles.mail_true : styles.mail]}>
                    <View style={styles.space}>
                      <TextThemed style={styles.nick}>{mail.other_nickname}</TextThemed>

                      <TextThemed style={{ alignContent: "space-between" }}>
                        {/* 시간이 최근에 채팅한 시간이 아니라 최초에 채팅한 시간을 기준으로 하고 있음, 이것도 백엔드에서 해야하는 것 같음 */}
                        {formatTimeDifference(new Date(mail.time))}
                      </TextThemed>
                      {/* 삭제 기능 제대로 됨 ,나중에 버튼 새로 깔끔하게 만들기 */}
                    </View>
                    <Container style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <TextThemed style={styles.content}>{mail.last_content}</TextThemed>
                      <TextButton
                        style={{ justifyContent: "flex-end" }}
                        onPress={() => del(mail.id)}
                      >
                        삭제
                      </TextButton>
                    </Container>
                  </View>
                </TouchableOpacity>
                <View
                  style={{ borderBottomWidth: 1, borderColor: "rgba(232,234,236,0.5)", height: 0 }}
                ></View>
              </>
            ))}
          </View>
        </View>
      </ScrollView>
      <Container
        style={{
          backgroundColor: "#e9ecef",
          borderRadius: 100,
          position: "absolute",
          right: "10%",
          bottom: "5%",
        }}
      >
        <TextButton
          style={{ flex: 1, backgroundColor: "#e9ecef" }}
          paddingVertical={10}
          onPress={searchUser}
        >
          <Entypo name="plus" size={24} color="black" />
        </TextButton>
      </Container>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "15%",
    marginLeft: "8%",
    marginRight: "3%",
    marginBottom: "3%",
  },
  mailText: {
    fontSize: 30,
    fontWeight: "600",
  },

  sender: {
    border: "2px",
  },
  mail: {
    padding: "3%",
  },
  mail_true: {
    backgroundColor: "rgba(82, 153, 235, 0.3)",
  },
  nick: {
    fontSize: 22,
    fontWeight: "700",
  },
  content: {
    marginLeft: "7%",
    paddingTop: "2%",
    fontSize: 18,
  },
  space: {
    marginLeft: "5%",
    marginRight: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  date: {
    alignContent: "space-between",
  },
  icon: {
    // backgroundColor: "transparent",
    color: "black",
    position: "absolute",
    right: "10%",
    bottom: "5%",
    backgroundColor: "#5299EB",
    borderRadius: 50,
    padding: 10,
  },
});
export default Mail;
