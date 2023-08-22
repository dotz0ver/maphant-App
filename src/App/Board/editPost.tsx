import { useNavigation, useRoute } from "@react-navigation/native";
import CheckBox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";

import { boardEdit } from "../../Api/board";
import { BoardType } from "../../App/Board/BoardList";
import { Container, Input, Spacer, TextButton } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";
import { BoardPost } from "../../types/Board";

const Edit: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [checkList, setCheckList] = useState<string[]>([]);
  const [isHide, setIsHide] = useState<number>(0);
  const [isAnonymous, setIsAnonymous] = useState<number>(0);
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const navigation = useNavigation<NavigationProps>();

  const editparams = useRoute().params as { post: BoardPost };
  const post = editparams?.post;

  useEffect(() => {
    // 받아온 게시판 타입(boardType)을 이용하여 필요한 작업 수행
    setTitle(post.board.title);
    setBody(post.board.body);
    setIsHide(post.board.isHide);
    setIsAnonymous(post.board.isAnonymous);
    // setHashtags(post.board.tags.map(word => "#" + word));
  }, []);

  const check = (name: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckList([...checkList, name]);
    } else {
      setCheckList(checkList.filter(choice => choice !== name));
    }
  };

  const handleUpdate = async () => {
    const DBnewHashtags = hashtags.map(word => word.replace(/^#/, ""));
    try {
      const response = await boardEdit(post.board.id, title, body, isHide);
      console.log(response);
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Container style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Container
          style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}
        >
          <Container style={{ flexDirection: "row", marginRight: 10 }}>
            <CheckBox
              style={{ marginRight: 5 }}
              value={isHide == 1 ? true : false}
              onValueChange={isChecked => {
                check("private", isChecked);
                setIsHide(isChecked ? 1 : 0);
              }}
            ></CheckBox>
            <Text>비공개</Text>
          </Container>
          <Container style={{ flexDirection: "row" }}>
            <CheckBox
              style={{ marginRight: 5 }}
              value={isAnonymous == 1 ? true : false}
              onValueChange={isChecked => {
                check("anonymous", isChecked);
              }}
            ></CheckBox>
            <Text>익명</Text>
          </Container>
        </Container>
        <Container style={{ flexDirection: "row" }}>
          <TextButton onPress={handleUpdate}>완료</TextButton>
        </Container>
      </Container>
      <Container>
        <Input
          placeholder="제목"
          onChangeText={text => setTitle(text)}
          value={title}
          multiline={true}
        ></Input>
        <Spacer size={20} />
        <Input
          style={{ height: 500 }}
          placeholder="본문"
          onChangeText={text => setBody(text)}
          value={body}
          multiline={true}
        ></Input>
      </Container>
    </Container>
  );
};

export default Edit;
