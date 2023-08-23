import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { sha512 } from "js-sha512";
import React, { useEffect, useState } from "react";
import { Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import { GetAPI, statusResponse } from "../../Api/fetchAPI";
import { Spacer, TextButton } from "../../components/common";
import UserStorage from "../../storage/UserStorage";

function uploadAPI<T extends statusResponse>(
  method: string = "PATCH",
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

const Myimg: React.FC = () => {
  const [imgUploadMoal, setImgUploadModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [requsetpermission, setRequestPermission] = ImagePicker.useCameraPermissions();
  const [defaultImg, setDefaultImg] = useState(true);
  const [defaultImgSrc, setDefaultImgSrc] = useState(
    "https://tovelope.s3.ap-northeast-2.amazonaws.com/image_1.jpg",
  );

  const userID = useSelector(UserStorage.userProfileSelector)!.id;

  useEffect(() => {
    GetAPI(`/profile?targerUserId=${userID}`).then(res => {
      if (res.success == true) {
        if (res && res.data && res.data[0] && res.data[0].profile_img)
          setDefaultImgSrc(res.data[0].profile_img);
      }
    });
  }, []);

  const uploadImage = async () => {
    //권한 승인
    if (!requsetpermission?.granted) {
      const permission = await setRequestPermission();
      if (!permission.granted) {
        return null;
      }
    }

    //이미지 업로드
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });
    //이미지 업로드 취소시
    if (result.canceled) {
      return null;
    }
    //이미지 업로드 결과 및 이미지 경로 업데이트

    setImageUrl(result.assets[0].uri);

    const formData = new FormData();
    formData.append("file", {
      name: "profile_img.jpg",
      type: "image/jpeg",
      uri: result.assets[0].uri,
    });

    try {
      const res = await uploadAPI("PATCH", "/profile", formData);
    } catch (err) {
      Alert.alert(err);
    }
  };

  const deleteImage = async () => {
    const formData = new FormData();
    formData.append("file", {
      name: "default_profile_img.jpg",
      type: "image/jpeg",
      uri: "https://tovelope.s3.ap-northeast-2.amazonaws.com/image_1.jpg",
    });

    try {
      const res = await uploadAPI("PATCH", "/profile", formData);
      Alert.alert("프로필 사진이 삭제되었습니다.");
    } catch (err) {
      Alert.alert(err);
    }

    GetAPI(`/profile?targerUserId=${userID}`).then(res => {
      if (res.success == true) {
        if (res && res.data && res.data[0] && res.data[0].profile_img)
          setDefaultImgSrc(res.data[0].profile_img);
      }
    });
  };

  return (
    <View style={styles.profileImgContainer}>
      <TouchableOpacity
        onPress={() => {
          setImgUploadModal(true);
        }}
      >
        <Image
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderColor: "#aaa",
            borderWidth: 2,
          }}
          source={defaultImg == true ? { uri: defaultImgSrc } : { uri: imageUrl }}
        />
      </TouchableOpacity>
      <Modal animationType="fade" transparent={true} visible={imgUploadMoal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={{ alignItems: "flex-end" }}
              onPress={() => {
                setImgUploadModal(false);
              }}
              hitSlop={{ top: 32, bottom: 32, left: 32, right: 32 }}
            >
              <AntDesign name="closecircle" size={20} color="#aaa" />
            </TouchableOpacity>
            {/* <Spacer size={5} /> */}
            <View style={{ alignItems: "center" }}>
              <Text style={styles.Moaltext}>프로필 사진을 선택해주세요</Text>
            </View>
            <Spacer size={20} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  borderColor: "#aaa",
                  borderWidth: 2,
                }}
                source={defaultImg == true ? { uri: defaultImgSrc } : { uri: imageUrl }}
              />
              <Spacer size={10} />
            </View>
            <Spacer size={20} />
            <View style={styles.modalBtnDirection}>
              <TextButton
                style={styles.modalConfirmBtn}
                onPress={() => {
                  deleteImage();
                  setDefaultImg(true);
                  setImgUploadModal(false);
                }}
              >
                삭제
              </TextButton>
              <TextButton
                style={styles.modalConfirmBtn}
                onPress={() => {
                  uploadImage();
                  setDefaultImg(false);
                }}
              >
                수정
              </TextButton>
            </View>
            <Spacer size={5} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImgContainer: {
    paddingVertical: 5,
    // backgroundColor: "green",
  },
  modalConfirmBtn: {
    width: "45%",
  },
  modalBtnDirection: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modifyingContentWidth: {
    width: "75%",
  },
  modalBackground: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 0.8,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    padding: 15,
  },
  modalInput: {
    width: "100%",
    paddingVertical: "5%",
    backgroundColor: "#D8E1EC",
  },
  Moaltext: {
    fontSize: 17,
    fontWeight: "bold",
  },
});
export default Myimg;
