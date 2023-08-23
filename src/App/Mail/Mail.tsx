import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { deleteChat, receiveChatrooms } from "../../Api/member/FindUser";
import { Container, TextButton, TextThemed } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";
import { MessageList } from "../../types/DM";
import { formatTimeDifference } from "../../utils/Time";

const Mail: React.FC = () => {
  //is_read : 안 읽었을때 1 = true 읽었을 때 0 = false
  // sendDate 가 들어왔을 때 분전 , 시간 전으로 바꾸는 코드

  const [chatList, setChatList] = useState<MessageList[]>([]);
  const navigation = useNavigation<NavigationProps>();
  const del = (id: number) => {
    deleteChat(id);
  };
  const searchUser = () => {
    navigation.navigate("SearchUser" as never);
  };
  const fetchChatRooms = useCallback(async () => {
    try {
      await receiveChatrooms().then(res => {
        if (res.success) {
          setChatList(res.data);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }, [chatList]);

  useEffect(() => {
    const interval = setInterval(() => fetchChatRooms(), 1000);

    return () => {
      clearInterval(interval);
    };
  });
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
            <View style={{ marginBottom: 10 }}>
              {chatList.map(mail => (
                // eslint-disable-next-line react/jsx-key
                <View key={mail.id}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Chatroom", {
                        id: mail.other_id,
                        nickname: mail.other_nickname,
                        roomId: mail.id,
                      } as never);
                    }}
                  >
                    <View style={[styles.mail, mail.unread_count ? styles.mail_true : styles.mail]}>
                      <View style={styles.space}>
                        <TextThemed style={styles.nick}>{mail.other_nickname}</TextThemed>
                        <TextThemed style={{ alignContent: "space-between" }}>
                          {formatTimeDifference(new Date(mail.time))}
                        </TextThemed>
                      </View>
                      <Container style={{ maxHeight: 100 }}>
                        <TextThemed style={styles.content} numberOfLines={2}>
                          {mail.last_content}
                        </TextThemed>
                        <TextButton style={{ marginLeft: 320 }} onPress={() => del(mail.id)}>
                          삭제
                        </TextButton>
                      </Container>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: "rgba(232,234,236,0.5)",
                      height: 0,
                    }}
                  ></View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <Container
        style={{
          backgroundColor: "#e9ecef",
          borderRadius: 50,
          position: "absolute",
          right: "10%",
          bottom: "5%",
        }}
      >
        <TextButton
          style={{
            flex: 1,
            backgroundColor: "#e9ecef",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
          paddingVertical={16}
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
    marginLeft: "6%",
    marginRight: "5.5%",
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
