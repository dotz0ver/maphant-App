import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import CheckBox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { sha512 } from "js-sha512";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { boardPost } from "../../Api/board";
import { statusResponse } from "../../Api/fetchAPI";
import { BoardType } from "../../App/Board/BoardList";
import { Container, Input, Spacer, TextButton } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";
import UserStorage from "../../storage/UserStorage";

function uploadAPI<T extends statusResponse>(
  method: string = "POST",
  url: string,
  body?: FormData,
) {
  return UserStorage.getUserToken().then(token => {
    const abortController = new AbortController();
    const abortSignal = abortController.signal;
    setTimeout(() => abortController.abort(), 10000);

    const options: RequestInit = {
      method: method,
      signal: abortSignal,
      headers: {},
    };
    if (token != undefined) {
      // @ts-expect-error
      options.headers["x-auth"] = token.token;
      // @ts-expect-error
      options.headers["x-timestamp"] = Math.floor(Date.now() / 1000);
      // @ts-expect-error
      options.headers["x-sign"] = sha512(
        // @ts-expect-error
        `${options.headers["x-timestamp"]}${token.privKey}`,
      );
    }

    if (method != "GET") {
      options.body = body;
    }

    const url_complete = `https://dev.api.tovelop.esm.kr${url}`;
    return fetch(url_complete, options)
      .catch(err => {
        if (err.name && (err.name === "AbortError" || err.name === "TimeoutError")) {
          return Promise.reject("서버와 통신에 실패 했습니다 (Timeout)");
        }

        return Promise.reject("서버와 통신 중 오류가 발생했습니다.");
      })
      .then(res => {
        // 특수 처리 (로그인 실패시에도 401이 들어옴)
        // 로그인의 경우는 바로 내려 보냄
        if (url == "/user/login") {
          return res.json();
        }

        if (res.status === 401) {
          // 로그인 안됨 (unauthorized)
          UserStorage.removeUserData();
          return Promise.reject("로그인 토큰이 만료되었습니다.");
        }

        return res.json();
      })
      .then(json => {
        const resp = json as T;

        return Promise.resolve({ json: resp });
      });
  });
}

const Post: React.FC = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [checkList, setCheckList] = useState<string[]>([]);
  const [isanonymous, setIsanonymous] = useState(0);
  const [isHide, setIsHide] = useState(0);
  const [voteInputs, setVoteInputs] = useState(false);
  const [voteTitle, setVoteTitle] = useState("");
  const [voteOptions, setVoteOptions] = useState<string[]>([]);

  const [requsetpermission, setRequestPermission] = ImagePicker.useCameraPermissions();
  const [imageUrl, setImageUrl] = useState<string[]>([]);

  const [postImageUrl, setPostImageUrl] = useState<string[]>([]);

  const params = useRoute().params as { boardType: BoardType };
  const boardType = params?.boardType;
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {}, [boardType]);

  const check = (name: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckList([...checkList, name]);
    } else {
      setCheckList(checkList.filter(choice => choice !== name));
    }
  };

  const complete = async () => {
    const DBnewHashtags = hashtags.map(word => word.replace(/^#/, ""));
    if (voteOptions.some(option => option.trim() === "")) {
      alert("옵션 내용을 입력해 주세요.");
      return;
    }

    try {
      const response = await boardPost(
        null,
        boardType.id,
        title,
        body,
        isHide,
        0,
        isanonymous,
        postImageUrl.length == 0 ? undefined : postImageUrl,
        { title: voteTitle, options: voteOptions }, // poll
        DBnewHashtags,
      );

      if (response.success == true) {
        Alert.alert("게시물 작성 되었습니다.");
      }
      navigation.navigate("DetailList", { boardType: boardType });
    } catch (error) {
      Alert.alert(error);
    }
  };

  const updateHashtags = () => {
    const words = hashtagInput.split(" ");
    const newHashtags = words.filter(word => word.startsWith("#"));
    setHashtags(newHashtags);
  };

  const addHashtag = () => {
    if (hashtagInput.trim() !== "") {
      updateHashtags();
      setHashtagInput("");
    }
  };

  const voteHandling = async () => {
    setVoteInputs(!voteInputs);
  };

  const addVoteOptions = async () => {
    setVoteOptions([...voteOptions, ""]);
  };

  const handleVoteOptionChange = (index: number, text: string) => {
    const updatedOptions = [...voteOptions];
    updatedOptions[index] = text;
    setVoteOptions(updatedOptions);
  };

  const handleRemoveVoteOption = (indexToRemove: number) => {
    setVoteOptions(voteOptions.filter((_, index) => index !== indexToRemove));
  };

  const uploadImage = async () => {
    if (!requsetpermission?.granted) {
      const permission = await setRequestPermission();
      if (!permission.granted) {
        return null;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    //이미지 업로드 취소시
    if (result.canceled) {
      return null;
    }
    const selectedImages = result.assets.slice(0, 5);

    try {
      // Call the uploadImageAsync function to upload the selected images
      await uploadImageAsync(selectedImages);
    } catch (error) {
      Alert.alert(error);
      // Handle the error
    }
    setImageUrl(selectedImages.map(image => image.uri));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function uploadImageAsync(images: any[]) {
      const formData = new FormData();

      images.forEach((image, index) => {
        // @ts-expect-error
        formData.append("files", {
          uri: image.uri,
          type: "image/jpeg",
          name: `image_${index + 1}.jpg`,
        });
      });

      try {
        // const response = await uploadAPI(formData);
        const response = uploadAPI("POST", "/image", formData);
        const jsonResponse = (await response).json;
        for (const item of jsonResponse) {
          const imageUrl = item.url;
          postImageUrl.push(imageUrl);
        }
        setPostImageUrl(postImageUrl);
      } catch (error) {
        Alert.alert(error);
      }
    }
  };
  const handleRemoveImage = (indexToRemove: number) => {
    const newImageUrl = imageUrl.filter((_, index) => index !== indexToRemove);
    setPostImageUrl(newImageUrl);
    setImageUrl(newImageUrl);
  };

  return (
    <Container style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 10 }}>
      <Container
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Container
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
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
          <TouchableOpacity onPress={voteHandling} style={{ alignItems: "center", marginRight: 5 }}>
            <MaterialCommunityIcons
              name="vote"
              size={24}
              color={voteInputs == false ? "#666666" : "#5299EB"}
            />
            <Text style={{ color: "#666666", fontSize: 13 }}>투표 만들기</Text>
          </TouchableOpacity>
        </Container>
        <Container style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={uploadImage} style={{ alignItems: "center", marginRight: 5 }}>
            <AntDesign name="camerao" size={24} color="#666666" />
            <Text style={{ color: "#666666", fontSize: 13 }}>사진 업로드</Text>
          </TouchableOpacity>
        </Container>
        <Container style={{ flexDirection: "row" }}>
          <TextButton onPress={complete} fontSize={13}>
            완료
          </TextButton>
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
        <TextInput
          placeholder="#해시태그 형식을 지켜주세요."
          onChangeText={text => setHashtagInput(text)}
          value={hashtagInput}
          multiline={true}
          onEndEditing={addHashtag}
        ></TextInput>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {hashtags.map((tag, index) => (
            <Text key={index}>
              <Text style={{ backgroundColor: "#C9E4F9" }}>{tag}</Text>
              {"   "}
            </Text>
          ))}
        </View>
        {voteInputs && (
          <>
            <Spacer size={20} />
            <Container style={{ flexDirection: "row" }}>
              <Input
                style={{ width: "80%", marginRight: 10, height: 35 }}
                placeholder="투표 제목"
                onChangeText={text => setVoteTitle(text)}
                value={voteTitle}
              />
              <TextButton onPress={addVoteOptions} fontSize={13}>
                추가
              </TextButton>
            </Container>
            <Spacer size={10} />
            <Container>
              {voteOptions.map((option, index) => (
                <>
                  <Container style={{ flexDirection: "row", alignItems: "center" }} key={index}>
                    <Input
                      style={{ flex: 1 }}
                      key={index}
                      placeholder={`투표 선택지 ${index + 1}`}
                      onChangeText={text => handleVoteOptionChange(index, text)}
                      value={option}
                    />
                    <TouchableOpacity onPress={() => handleRemoveVoteOption(index)}>
                      <Text style={{ color: "black" }}>X</Text>
                    </TouchableOpacity>
                  </Container>
                  <Spacer size={10} />
                </>
              ))}
            </Container>
          </>
        )}
        <Spacer size={10} />
        <View style={{ flexDirection: "row" }}>
          {hashtags.map((tag, index) => (
            <Text key={index}>
              <Text style={{ backgroundColor: "#C9E4F9" }}>{tag}</Text>
              {"   "}
            </Text>
          ))}
        </View>

        <Spacer size={20} />
        <Input
          style={{ height: "40%" }}
          placeholder="본문"
          onChangeText={text => setBody(text)}
          value={body}
          multiline={true}
        ></Input>
        <ScrollView horizontal={true} style={{ flexDirection: "row" }}>
          <Spacer size={20} />
          {Array.isArray(imageUrl) &&
            imageUrl.map((uri, index) => (
              <>
                <Image
                  key={index}
                  source={{ uri: uri }}
                  style={{ width: 200, height: 200, marginRight: 5 }} // 이미지 간 간격을 조절해줍니다.
                />
                <FontAwesome
                  name="remove"
                  size={24}
                  color="black"
                  onPress={() => handleRemoveImage(index)}
                />
              </>
            ))}
        </ScrollView>
      </Container>
    </Container>
  );
};

export default Post;
