import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";

import { confirmEmail } from "../../Api/member/signUp";
import { Container, Input, TextButton, TextThemed } from "../../components/common";
import { SignUpFormParams } from "../../Navigator/SigninRoutes";
import { ISignupForm } from "../../types/SignUp";

const Confirm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  // const verificationCodeInputRef = useRef<TextInput>(null);
  const [showNextButton, setShowNextButton] = useState(true);
  const route = useRoute();
  const params = route.params as SignUpFormParams;

  const navigation = useNavigation<NavigationProp<{ SearchUniversity: SignUpFormParams }>>();

  useEffect(() => {
    if (params && params.email) setEmail(params.email);
  }, [route]);

  const checkCode = (values: ISignupForm) => {
    values.email = email;
    if (showNextButton) {
      navigation.navigate("SearchUniversity", params);
    }
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
          Alert.alert("Success", "인증이 완료되었습니다.", [
            {
              text: "이동",
              onPress: () => {
                navigation.navigate("SearchUniversity", params);
              },
            },
          ]);
          setShowNextButton(true);
        }
      })
      .catch(error => Alert.alert(error));
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

  return (
    <Container style={{ flex: 1, paddingHorizontal: 40, paddingTop: 80 }}>
      <Container style={{ alignItems: "flex-end", marginRight: 10 }}>
        <TextThemed style={{ fontSize: 12 }}>
          {`${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
        </TextThemed>
      </Container>
      <Container style={{ marginBottom: 20 }}>
        <TextThemed style={{ fontSize: 16, paddingLeft: 10 }}>이메일</TextThemed>
        <Input
          value={email}
          placeholder="이메일을 입력해주세요."
          keyboardType="email-address"
          editable={false}
          style={styles.input}
        />
      </Container>

      <Container style={{ marginBottom: 20 }}>
        <TextThemed style={{ fontSize: 16, paddingLeft: 10 }}>인증 번호</TextThemed>
        <Input
          // inputRef={verificationCodeInputRef}
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
              backgroundColor: verificationCode === "" ? "#999" : "#0055FF",
              borderColor: verificationCode === "" ? "#999" : "#0055FF",
              width: 80,
            },
          ]}
        >
          확인
        </TextButton>
        {/* {showNextButton && (
          <TextButton
            activeOpacity={0.7}
            onPress={checkCode}
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
            다음
          </TextButton>
        )} */}
      </Container>
    </Container>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderRadius: 50,
    width: 300,
    height: 40,
    borderColor: "#aaa",
    marginTop: 10,
    justifyContent: "center",
  },
  button: {
    borderWidth: 1,
    borderRadius: 4,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Confirm;
