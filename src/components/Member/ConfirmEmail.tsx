import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";

import { authenticationCode, sendEmail } from "../../Api/member/signUp";
import { Container, Input, Spacer, TextButton } from "../common";

const ConfirmEmail = ({
  onEmailChange,
  onAuthcodeChange,
  email,
  authcode,
}: {
  onEmailChange: (email: string) => void;
  onAuthcodeChange: (authcode: string) => void;
  email: string;
  authcode: string;
}) => {
  const [certificationEmail, setCertificationEmail] = useState(false);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const verificationCodeInputRef = useRef<TextInput>(null);
  const [, setShowNextButton] = useState(false);

  const startTimer = () => {
    setMinutes(10);
    setSeconds(0);
  };

  const emailVerification = async () => {
    // API를 호출하여 이메일 인증 로직 구현
    await sendEmail(email).then(result => {
      if (result.success) {
        // 이메일 인증 성공
        setCertificationEmail(true);
      }
    });

    startTimer();
    verificationCodeInputRef.current?.focus();
  };

  const verifyCode = async () => {
    // API를 호출하여 인증 번호 검증 로직 구현
    await authenticationCode(email, authcode).then(result => {
      if (result.success) {
        Alert.alert("Success", "인증이 완료되었습니다.");
        // 인증 완료 처리
        setShowNextButton(true);
      }
    });
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
  const width: number = useWindowDimensions().width;

  return (
    <Container>
      {certificationEmail && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {`${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
          </Text>
        </View>
      )}
      <View style={{ alignItems: "center" }}>
        <Input
          style={{
            backgroundColor: "#F0F0F0",
            width: width * 0.79,
            height: 50,
            borderRadius: width * 0.5,
            flexDirection: "row",
          }}
          value={email}
          onChangeText={value => {
            onEmailChange(value);
          }}
          placeholder="이메일"
          placeholderTextColor="#636363"
          inputMode="email"
        />
      </View>
      <Spacer size={10} />
      <TextButton
        activeOpacity={0.7}
        onPress={emailVerification}
        fontSize={16}
        style={[
          styles.button,
          {
            flex: 0.2,
            backgroundColor: email === "" ? "#999" : "$0055FF",
            borderColor: email === "" ? "#999" : "#0055FF",
            width: 80,
          },
        ]}
      >
        인증 요청
      </TextButton>
      {minutes === 0 && seconds === 0
        ? null
        : certificationEmail && (
            <>
              <Spacer size={20} />
              <Input
                ref={verificationCodeInputRef}
                style={{
                  backgroundColor: "#F0F0F0",
                  width: width * 0.79,
                  height: 50,
                  borderRadius: width * 0.5,
                  flexDirection: "row",
                }}
                value={authcode}
                onChangeText={value => {
                  onAuthcodeChange(value);
                }}
                placeholder="인증 번호 6자리를 입력해 주세요."
                inputMode="numeric"
              />
              <Spacer size={10} />

              <TextButton
                activeOpacity={0.7}
                onPress={verifyCode}
                fontSize={16}
                style={[
                  styles.button,
                  {
                    flex: 0.2,
                    backgroundColor: email === "" ? "#999" : "$0055FF",
                    borderColor: email === "" ? "#999" : "#0055FF",
                    width: 80,
                  },
                ]}
              >
                확인
              </TextButton>
            </>
          )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    borderWidth: 1,
    borderRadius: 4,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 12,
    color: "#0055FF",
  },
  timerContainer: {
    alignItems: "flex-end",
    marginRight: 10,
  },
  timerText: {
    fontSize: 12,
    color: "#0055FF",
  },
  label: {
    position: "absolute",
    left: 10,
    fontSize: 16,
    color: "#aaa",
    backgroundColor: "transparent",
  },
});

export default ConfirmEmail;
