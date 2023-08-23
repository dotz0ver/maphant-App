//입력시 글자 흰색으로 바뀌게 해야함
import { useNavigation, useRoute } from "@react-navigation/native";
import CheckBox from "expo-checkbox";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text } from "react-native";

import { boardPost } from "../../Api/board";
import { Container, Input, Spacer, TextButton } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";

const QA_answer: React.FC = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [checkList, setCheckList] = useState<string[]>([]);
  const [isanonymous, setIsanonymous] = useState(0);
  const [isHide, setIsHide] = useState(0);

  const params = useRoute().params as { id: number };
  const { id } = params;
  const navigation = useNavigation<NavigationProps>();

  const check = (name: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckList([...checkList, name]);
    } else {
      setCheckList(checkList.filter(choice => choice !== name));
    }
  };

  const complete = async () => {
    try {
      const response = await boardPost(
        id,
        7,
        title,
        body,
        isHide,
        0,
        isanonymous,
        //hashtags.join(" "),
      );
      Alert.alert("게시물이 작성되었습니다.");
      navigation.goBack();
    } catch (error) {
      console.error("게시물 작성 오류", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{ padding: 5, borderRadius: 5 }}
    >
      <Container
        style={{ marginHorizontal: 15, marginVertical: 10 }}
        // isForceKeyboardAvoiding={true}
      >
        <Container style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Container
            style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}
          >
            <Container style={{ flexDirection: "row", marginRight: 10, alignItems: "center" }}>
              <CheckBox
                style={{ marginRight: 5 }}
                value={checkList.includes("private")}
                onValueChange={isChecked => {
                  check("private", isChecked);
                  setIsHide(isChecked ? 1 : 0);
                }}
              ></CheckBox>
              <Text>비공개</Text>
            </Container>
            <Container style={{ flexDirection: "row", marginRight: 10, alignItems: "center" }}>
              <CheckBox
                style={{ marginRight: 5 }}
                value={checkList.includes("anonymous")}
                onValueChange={isChecked => {
                  check("anonymous", isChecked);
                  setIsanonymous(isChecked ? 1 : 0);
                }}
              ></CheckBox>
              <Text>익명</Text>
            </Container>
          </Container>
          <Container style={{ flexDirection: "row" }}>
            <TextButton onPress={() => complete()}>완료</TextButton>
          </Container>
        </Container>
        <Container>
          <Input
            placeholder="제목"
            onChangeText={text => setTitle(text)}
            value={title}
            // multiline={true}
          ></Input>
          <Spacer size={20} />
          <Input
            style={{ minHeight: "75%" }}
            placeholder="본문"
            onChangeText={text => setBody(text)}
            value={body}
            multiline={true}
          ></Input>
        </Container>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default QA_answer;
