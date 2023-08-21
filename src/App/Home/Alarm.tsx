import { useTheme } from "@react-navigation/native";
import { useEffect } from "react";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { notificationsList } from "../../Api/member/Fcm";
import { fcmList } from "../../types/Fcm";
import loadDefaultStyles from "../Style/styles/Alarmcss";
const Alarm: React.FC = () => {
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
  const [fcmType, setFcmType] = React.useState<fcmList[]>([]);

  // console.info("에러 안뜨나???");
  // console.log(messaging().getToken());

  useEffect(() => {
    notificationsList(1, 50)
      .then(data => {
        setFcmType(data.data.list as fcmList[]);
      })
      .catch(err => console.error(err));
  }, []);
  console.log(fcmType);
  const fetchData = async () => {
    try {
      const response = notificationsList(1, 50).catch(err => alert(err));
      console.log("왜 안떠 ㅁㅊ ");
      console.log(response);
      // setFcmType(response.data as fcmList[]);
      // console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const theme = useTheme();
  const styles = loadDefaultStyles(theme);

  return (
    <ScrollView style={styles.container}>
      {fcmType.map(fcm => (
        <View key={fcm.id}>
          <Pressable
            onPress={() => {
              console.log(fcm.title);
              fetchData();
              console.log(fcmType);
            }}
            style={fcm.readAt != null ? styles.showbody : styles.body}
          >
            <View style={styles.body2}>
              {/* <FontAwesome name={board.icon} size={24} color="grey" style={{ marginRight: 10 }} /> */}
              <View style={styles.content}>
                <View style={styles.head}>
                  <Text style={styles.title}>{fcm.title}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text>{fcm.body}</Text>
                  <Text style={{ fontSize: 10, color: theme.colors.text }}>
                    {formatTimeDifference(new Date(fcm.createdAt))}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
};
export default Alarm;
