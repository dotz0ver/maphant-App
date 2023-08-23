import { useNavigation, useRoute } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";

import { PostAPI } from "../../Api/fetchAPI";
import { sendFcm } from "../../Api/member/Fcm";
import { confirmEmail } from "../../Api/member/signUp";
import UserAPI from "../../Api/memberAPI";
import { Container, Input, Spacer, TextButton } from "../../components/common";
import { SignUpFormParams } from "../../Navigator/SigninRoutes";
import UserStorage from "../../storage/UserStorage";

const Uncertified: React.FC = () => {
  const [email, setEmail] = useState("");
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  // const verificationCodeInputRef = useRef<TextInput>(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [sendEmail, setSendEmail] = useState(0);
  const route = useRoute();
  const params = route.params as SignUpFormParams;
  const navigation = useNavigation();

  useEffect(() => {
    if (params && params.email) setEmail(params.email);
  }, [route]);

  const login = () => {
    UserAPI.login(email, params.password)
      .then(res => {
        UserStorage.setUserToken(res["pubKey"], res["privKey"]).then(() => {
          return UserAPI.getProfile().then(res => {
            UserStorage.setUserProfile(res.data);
            Notifications.getDevicePushTokenAsync().then(res => sendFcm(res.data));
          });
        });
      })
      .finally(() => {});
  };
  const verifyCode = () => {
    if (!verificationCode) {
      Alert.alert("Error", "인증 번호를 입력해주세요.");
      return;
    }

    // API를 호출하여 인증 번호 검증 로직 구현
    confirmEmail(email, verificationCode)
      .then(res => {
        if (res.success) {
          Alert.alert("인증이 완료되었습니다");
          //navigation.navigate("Login" as never);
          // 인증 완료 처리
          setShowNextButton(true);
        }
        // Internal Server Error때문에 res가 안받아져서 임시로 완료 처리(state는 잘 바뀜)
        // else if (res.success !== false) {
        //   Alert.alert("Success", "인증이 완료되었습니다.1");
        //   // 인증 완료 처리
        //   setShowNextButton(true);
        // }
      })
      .catch(error => Alert.alert(error))
      .finally(() => {});
  };

  useEffect(() => {
    const countDown = setInterval(() => {
      if (minutes === 0 && seconds === 0) {
        clearInterval(countDown);
      } else {
        if (seconds === 0) {
          setMinutes(prevMinutes => prevMinutes - 1);
          setSeconds(59);
        } else {
          setSeconds(prevSeconds => prevSeconds - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(countDown);
    };
  }, [minutes, seconds]);

  useEffect(() => {
    PostAPI(`/email/sendsignup`, { email: params.email })
      .then(res => {
        if (res.success === true) {
          alert("인증번호가 전송되었습니다.");
        } else {
          alert("인증번호 전송에 실패하였습니다.");
        }
      })
      .catch(err => {
        alert("서버 오류\n" + err);
      });
  }, [sendEmail]);

  return (
    <Container style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 40, paddingTop: 80 }}>
      <Container style={{ alignItems: "flex-end", marginRight: 10 }}>
        <Text style={{ color: "#0055FF", fontSize: 12 }}>
          {`${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
        </Text>
      </Container>
      <Container style={{ marginBottom: 20 }}>
        <Text>이메일</Text>
        <Input
          value={email}
          placeholder="이메일을 입력해주세요."
          keyboardType="email-address"
          editable={false}
          style={styles.input}
        />
        <Spacer size={10} />
        <TextButton
          activeOpacity={0.7}
          onPress={() => setSendEmail(sendEmail + 1)}
          fontSize={15}
          style={{
            backgroundColor: "skyblue",
            borderColor: "skyblue",
            width: 80,
            height: 50,
          }}
        >
          재전송
        </TextButton>
      </Container>

      <Container style={{ marginBottom: 20 }}>
        <Text>인증 번호</Text>
        <Input
          // ref={verificationCodeInputRef}
          value={verificationCode}
          onChangeText={setVerificationCode}
          placeholder="인증번호 6자리를 입력해주세요."
          keyboardType="numeric"
          style={styles.input}
        />
      </Container>
      <Container
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginBottom: 20,
        }}
      >
        <TextButton
          activeOpacity={0.7}
          onPress={verifyCode}
          fontSize={18}
          style={[
            styles.button,
            {
              backgroundColor: verificationCode === "" ? "#999" : "$0055FF",
              borderColor: verificationCode === "" ? "#999" : "#0055FF",
              width: 80,
            },
          ]}
        >
          확인
        </TextButton>
        {showNextButton && (
          <TextButton
            activeOpacity={0.7}
            onPress={login}
            fontSize={18}
            style={[
              styles.button,
              {
                backgroundColor: verificationCode === "" ? "#999" : "$0055FF",
                borderColor: verificationCode === "" ? "#999" : "#0055FF",
                width: 80,
              },
            ]}
          >
            로그인
          </TextButton>
        )}
      </Container>
    </Container>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 4,
    width: 300,
    height: 40,
    padding: 8,
    borderColor: "#999",
    marginLeft: 10,
    marginTop: 10,
  },
  button: {
    borderWidth: 1,
    borderRadius: 4,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Uncertified;
