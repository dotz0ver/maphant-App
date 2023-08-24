import { useTheme } from "@react-navigation/native";
import { useEffect } from "react";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { notificationsList } from "../../Api/member/Fcm";
import { fcmList } from "../../types/Fcm";
import { formatTimeDifference } from "../../utils/Time";
import loadDefaultStyles from "../Style/styles/Alarmcss";
const Alarm: React.FC = () => {
  const [fcmType, setFcmType] = React.useState<fcmList[]>([]);

  useEffect(() => {
    notificationsList(1, 50)
      .then(data => {
        setFcmType(data.data.list as fcmList[]);
      })
      .catch(err => Alert.alert(err));
  }, []);
  const fetchData = async () => {
    try {
      await notificationsList(1, 50);
      // setFcmType(response.data as fcmList[]);
    } catch (err) {
      Alert.alert(err);
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
              fetchData();
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
