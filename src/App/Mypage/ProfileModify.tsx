import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Field, Formik, FormikErrors } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { useSelector } from "react-redux";

import { DeleteAPI, GetAPI, PostAPI } from "../../Api/fetchAPI";
import { categoryList, majorList } from "../../Api/member/signUp";
import UserAPI from "../../Api/memberAPI";
import { Container, Input, Spacer, TextButton, TextThemed } from "../../components/common";
import SearchByFilter from "../../components/Input/SearchByFilter";
import { NavigationProps } from "../../Navigator/Routes";
import UserStorage from "../../storage/UserStorage";
import { set } from "react-native-reanimated";

interface ISearchForm {
  field: string;
  major: string;
}

const ProfileModify: React.FC = () => {
  const profile = useSelector(UserStorage.userProfileSelector);

  type UserType = {
    email?: string;
    password: string;
    confirmPassword: string;
    nickname: string;
    name?: string;
    phoneNumber: string;
    studentNumber?: number;
  };

  const usetModifying: UserType = {
    email: profile?.email,
    password: "",
    confirmPassword: "",
    nickname: "",
    name: profile?.name,
    phoneNumber: "",
    studentNumber: profile?.sno,
  };

  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  let tmpNickname = "";
  let tmpPhoneNumber = "";
  const [studentNum, setStudentNum] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [modifyingPassWordModal, setModyfyingPassWordModal] = useState(false);
  const [modifyingNicknameModal, setModyfyingNicknameModal] = useState(false);
  const [modifyingPhoneNumModal, setModyfyingPhoneNumModal] = useState(false);
  const [modifyingFieldModal, setModyfyingFieldModal] = useState(false);
  const [pressedStates, setPressedStates] = useState(Array(profile?.category?.length).fill(false));
  const [deleteState, setDeleteState] = useState(false);
  const navigation = useNavigation<NavigationProps>();

  const onSubmit = useCallback((errors: FormikErrors<ISearchForm>, next: () => void) => {
    if (Object.keys(errors).length === 0) {
      next();
    }

    const msg = Object.values(errors)
      .map(val => `${val}`)
      .join("\n");
    return msg;
  }, []);

  useEffect(() => {
    PostAPI("/user/changeinfo/olddata").then(res => {
      if (res.success == true) {
        console.log(res.data);
        setUserEmail(res.data.email);
        setPassword(res.data.password);
        setNickname(res.data.nickname);
        setStudentNum(res.data.sno);
        setPhoneNumber(res.data.phNum);
      }
    });
  }, []);

  const handlePress = (index: number) => {
    const newPressedStates = [...pressedStates];
    newPressedStates[index] = !newPressedStates[index];
    setPressedStates(newPressedStates);
  };

  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [majorList, setMajorList] = useState<string[]>([]);
  const [filteredCategoryList, setFilteredCategoryList] = useState<string[]>([]);
  const [filteredMajorList, setFilteredMajorList] = useState<string[]>([]);
  const [searchCategoryText, setSearchCategoryText] = useState<string>("");
  const [searchMajorText, setSearchMajorText] = useState<string>("");
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    GetAPI(`/user/categorylist`).then(res => setCategoryList(res.data));

    GetAPI(`/user/majorlist`).then(res => setMajorList(res.data));
  }, []);

  const handleSearch = (listType: string) => (text: string) => {
    const filteredList =
      listType === "category"
        ? categoryList.filter((item: string) => item.toLowerCase().includes(text.toLowerCase()))
        : majorList.filter((item: string) => item.toLowerCase().includes(text.toLowerCase()));

    if (listType === "category") {
      setFilteredCategoryList(filteredList);
      setSearchCategoryText(text);
    } else if (listType === "major") {
      setFilteredMajorList(filteredList);
      setSearchMajorText(text);
    }
  };

  const renderItem =
    (listType: string) =>
    // eslint-disable-next-line react/display-name
    ({ item }) =>
      (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handleSelectField(item, listType)}
        >
          <Text style={{ fontSize: 15 }}>{item}</Text>
        </TouchableOpacity>
      );

  const handleSelectField = (selectedField: string, listType: string) => {
    if (listType === "category") {
      setSearchCategoryText(selectedField);
      setKey(key + 1);
    } else if (listType === "major") {
      setSearchMajorText(selectedField);
      setKey(key + 1);
    }
  };

  return (
    <Container paddingHorizontal={10}>
      <ScrollView
        contentContainerStyle={{
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Container>
          <View>
            {/* -----------이메일 */}
            <TextThemed style={styles.text}>이메일</TextThemed>
            <View style={styles.modifyingContainer}>
              <TextThemed style={styles.text}>{userEmail}</TextThemed>
            </View>

            {/* --------------비밀번호 수정 */}
            <View style={styles.childRow}>
              <View style={styles.modifyingContentWidth}>
                <TextThemed style={styles.text}>비밀번호</TextThemed>
                <View style={styles.modifyingContainer}>
                  <TextThemed style={styles.text}>
                    {password.length >= 1 ? "**********" : "비밀번호를 확인해주세요"}
                  </TextThemed>
                </View>
              </View>
              <View style={styles.modifyingBtn}>
                <TextButton
                  fontSize={16}
                  onPress={() => {
                    setModyfyingPassWordModal(true);
                  }}
                >
                  수정
                </TextButton>
              </View>
            </View>

            <Modal animationType="fade" transparent={true} visible={modifyingPassWordModal}>
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.text}>수정할 비밀번호</Text>
                      <TouchableOpacity
                        style={{ alignItems: "flex-end" }}
                        onPress={() => {
                          setModyfyingPassWordModal(false);
                        }}
                        hitSlop={{ top: 32, bottom: 32, left: 32, right: 32 }}
                      >
                        <AntDesign name="closecircle" size={20} color="#aaa" />
                      </TouchableOpacity>
                    </View>
                    <Spacer size={10} />
                    <Input
                      style={styles.modalInput}
                      paddingHorizontal={20}
                      borderRadius={30}
                      placeholder="password"
                      onChangeText={text => setPassword(text)}
                      secureTextEntry={true}
                    ></Input>
                    <Spacer size={10} />

                    <Text style={styles.text}>수정할 비밀번호 확인</Text>
                    <Spacer size={10} />

                    <Input
                      style={styles.modalInput}
                      paddingHorizontal={20}
                      borderRadius={30}
                      placeholder="confirmPassword"
                      onChangeText={text => setConfirmPassword(text)}
                      secureTextEntry={true}
                    ></Input>
                  </View>
                  <Spacer size={20} />
                  <View style={styles.modalBtnDirection}>
                    <TextButton
                      style={styles.modalConfirmBtn}
                      onPress={() => {
                        setModyfyingPassWordModal(false);
                      }}
                    >
                      취소
                    </TextButton>
                    <TextButton
                      style={styles.modalConfirmBtn}
                      onPress={() => {
                        if (password !== confirmPassword) {
                          alert("비밀번호가 일치하지 않습니다.");
                        } else {
                          PostAPI("/user/changeinfo/password", {
                            newPassword: password,
                            newPasswordCheck: confirmPassword,
                          })
                            .then(res => {
                              if (res.success === true) {
                                alert("비밀번호가 변경되었습니다.");
                                return;
                              }
                            })
                            .catch(err => alert(err));
                        }
                        setModyfyingPassWordModal(false);
                      }}
                    >
                      수정
                    </TextButton>
                  </View>
                  <Spacer size={5} />
                </View>
              </View>
            </Modal>

            {/* ---------닉네임 수정 */}
            <View style={styles.childRow}>
              <View style={styles.modifyingContentWidth}>
                <TextThemed style={styles.text}>닉네임</TextThemed>
                <View style={styles.modifyingContainer}>
                  <TextThemed style={styles.text}>{nickname}</TextThemed>
                </View>
              </View>
              <View style={styles.modifyingBtn}>
                <TextButton
                  fontSize={16}
                  onPress={() => {
                    setModyfyingNicknameModal(true);
                  }}
                >
                  수정
                </TextButton>
              </View>
            </View>

            <Modal animationType="fade" transparent={true} visible={modifyingNicknameModal}>
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.text}>수정할 닉네임</Text>
                      <TouchableOpacity
                        style={{ alignItems: "flex-end" }}
                        onPress={() => {
                          setModyfyingNicknameModal(false);
                        }}
                        hitSlop={{ top: 32, bottom: 32, left: 32, right: 32 }}
                      >
                        <AntDesign name="closecircle" size={20} color="#aaa" />
                      </TouchableOpacity>
                    </View>
                    <Spacer size={10} />
                    <Input
                      style={styles.modalInput}
                      paddingHorizontal={20}
                      borderRadius={30}
                      placeholder={nickname}
                      onChangeText={text => {
                        tmpNickname = text;
                      }}
                    ></Input>
                    <Spacer size={10} />
                  </View>
                  <Spacer size={20} />
                  <View style={styles.modalBtnDirection}>
                    <TextButton
                      style={styles.modalConfirmBtn}
                      onPress={() => {
                        setModyfyingNicknameModal(false);
                      }}
                    >
                      취소
                    </TextButton>
                    <TextButton
                      style={styles.modalConfirmBtn}
                      onPress={() => {
                        PostAPI("/user/changeinfo/nickname", {
                          nickname: tmpNickname,
                        })
                          .then(res => {
                            if (res.success == true) {
                              console.log(tmpNickname, "으로 닉네임 수정 성공");
                              setNickname(tmpNickname);
                              setModyfyingNicknameModal(false);
                            }
                          })
                          .catch(err => alert(err))
                          .finally(() =>
                            UserAPI.getProfile().then(res => {
                              UserStorage.setUserProfile(res.data);
                            }),
                          );
                      }}
                    >
                      수정
                    </TextButton>
                  </View>
                  <Spacer size={5} />
                </View>
              </View>
            </Modal>

            {/* ----------이름  */}
            <TextThemed style={styles.text}>이름</TextThemed>
            <View style={styles.modifyingContainer}>
              <TextThemed style={styles.text}>{usetModifying.name}</TextThemed>
            </View>

            {/* ----------학번 */}
            <TextThemed style={styles.text}>학번</TextThemed>
            <View style={styles.modifyingContainer}>
              <TextThemed style={styles.text}>{studentNum}</TextThemed>
            </View>

            {/* ----------핸드폰 번호 수정 */}
            <View style={styles.childRow}>
              <View style={styles.modifyingContentWidth}>
                <TextThemed style={styles.text}>핸드폰 번호</TextThemed>
                <View style={styles.modifyingContainer}>
                  <TextThemed style={styles.text}>
                    {phoneNumber == null ? "핸드폰번호를 입력해주세요" : phoneNumber}
                  </TextThemed>
                </View>
              </View>
              <View style={styles.modifyingBtn}>
                <TextButton
                  fontSize={16}
                  onPress={() => {
                    setModyfyingPhoneNumModal(true);
                  }}
                >
                  수정
                </TextButton>
              </View>
            </View>
            <Modal animationType="fade" transparent={true} visible={modifyingPhoneNumModal}>
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.text}>수정할 핸드폰 번호</Text>
                      <TouchableOpacity
                        style={{ alignItems: "flex-end" }}
                        onPress={() => {
                          setModyfyingPhoneNumModal(false);
                        }}
                        hitSlop={{ top: 32, bottom: 32, left: 32, right: 32 }}
                      >
                        <AntDesign name="closecircle" size={20} color="#aaa" />
                      </TouchableOpacity>
                    </View>
                    <Spacer size={10} />
                    <Input
                      style={styles.modalInput}
                      paddingHorizontal={20}
                      borderRadius={30}
                      placeholder={phoneNumber == null ? "010-0000-0000" : phoneNumber}
                      onChangeText={text => (tmpPhoneNumber = text)}
                    ></Input>
                    <Spacer size={10} />
                  </View>
                  <Spacer size={20} />
                  <View style={styles.modalBtnDirection}>
                    <TextButton
                      style={styles.modalConfirmBtn}
                      onPress={() => {
                        setModyfyingPhoneNumModal(false);
                      }}
                    >
                      취소
                    </TextButton>
                    <TextButton
                      style={styles.modalConfirmBtn}
                      onPress={() => {
                        PostAPI("/user/changeinfo/phnum", {
                          phNum: tmpPhoneNumber,
                        })
                          .then(res => {
                            console.log(res);
                            if (res.success == true) {
                              console.log("핸드폰번호 수정 성공");
                              setPhoneNumber(tmpPhoneNumber);
                              setModyfyingPhoneNumModal(false);
                            }
                          })
                          .catch(error => {
                            alert(error);
                          });
                      }}
                    >
                      수정
                    </TextButton>
                  </View>
                  <Spacer size={5} />
                </View>
              </View>
            </Modal>

            {/* 계열 추가하기 */}
            <View style={styles.childRow}>
              <View style={styles.modifyingContentWidth}>
                <TextThemed style={styles.text}>계열 / 학과</TextThemed>
                <View style={styles.modifyingContainer}>
                  {profile?.category?.map((category, index) => {
                    return (
                      <Pressable
                        key={index}
                        style={[
                          styles.pressable,
                          pressedStates[index] ? styles.pressablePressed : null,
                        ]}
                        onPress={() => {
                          handlePress(index);
                          console.log(profile.category.at(index));
                        }}
                      >
                        <TextThemed style={styles.fieldtext}>{category.categoryName}</TextThemed>
                        <TextThemed style={styles.fieldtext}>- {category.majorName}</TextThemed>
                        <Spacer size={10} />
                      </Pressable>
                    );
                  })}
                  {/* <Text style={/styles.fieldtext}>{useCategoryModifying.field}</Text>
                  <Text style={styles.fieldtext}>- {useCategoryModifying.major}</Text>
                  <Text style={styles.fieldtext}>{useCategoryModifying.field}</Text>
                  <Text style={styles.fieldtext}>- {useCategoryModifying.major}</Text>
                  <Text style={styles.fieldtext}>{useCategoryModifying.field}</Text>
                  <Text style={styles.fieldtext}>- {useCategoryModifying.major}</Text> */}
                </View>
              </View>
              <View style={styles.modifyingFieldBtn}>
                {pressedStates.includes(true) && (
                  <TextButton
                    fontSize={16}
                    onPress={() => {
                      const trueIndex = pressedStates.reduce((indices, state, index) => {
                        if (state === true) {
                          return [...indices, index];
                        }
                        return indices;
                      }, []);

                      for (let i = 0; i < trueIndex.length; i++) {
                        DeleteAPI("/user/changeinfo/categorymajor", {
                          category: profile?.category[trueIndex[i]].categoryName,
                          major: profile?.category[trueIndex[i]].majorName,
                        })
                          .then(res => {
                            if (res.success && deleteState === false) {
                              alert("선택된 항목들이 삭제되었습니다");
                              setDeleteState(true);
                            }
                          })
                          .catch(error => {
                            alert(`삭제에 실패하였습니다 : ${error}`);
                          })
                          .finally(() => {
                            UserAPI.getProfile().then(response => {
                              UserStorage.setUserProfile(response.data);
                            });
                          });
                      }
                      setDeleteState(false);
                    }}
                  >
                    삭제
                  </TextButton>
                )}
                <Spacer size={10} />
                <TextButton
                  fontSize={16}
                  onPress={() => {
                    setModyfyingFieldModal(true);
                  }}
                >
                  추가
                </TextButton>
              </View>
            </View>

            <Modal animationType="fade" transparent={true} visible={modifyingFieldModal}>
              <View style={styles.myModalBackground}>
                <View style={styles.myModalContainer}>
                  <View style={styles.myModalcategoryContainer}>
                    <Text style={styles.text}>계열 선택</Text>
                    <TextInput
                      placeholder="계열 검색"
                      value={searchCategoryText}
                      onChangeText={handleSearch("category")}
                      style={styles.myModalInput}
                    />
                    <Spacer size={10} />
                    <FlatList
                      key={key}
                      data={filteredCategoryList}
                      renderItem={renderItem("category")}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                  <View style={styles.myModalcategoryContainer}>
                    <Text style={styles.text}>학과 선택</Text>
                    <TextInput
                      placeholder="학과 검색"
                      value={searchMajorText}
                      onChangeText={handleSearch("major")}
                      style={styles.myModalInput}
                    />
                    <Spacer size={10} />
                    <FlatList
                      key={key}
                      data={filteredMajorList}
                      renderItem={renderItem("major")}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>

                  <View style={styles.myModalBtnDirection}>
                    <TextButton
                      style={styles.myModalConfirmBtn}
                      onPress={() => {
                        setModyfyingFieldModal(false);
                        setSearchCategoryText("");
                        setSearchMajorText("");
                      }}
                    >
                      취소
                    </TextButton>
                    <TextButton
                      style={styles.myModalConfirmBtn}
                      onPress={() => {
                        PostAPI("/user/changeinfo/categorymajor", {
                          category: searchCategoryText,
                          major: searchMajorText,
                        })
                          .then(response => {
                            console.info(response);
                            if (response.success) {
                              alert("학과, 계열 추가완료");
                            } else {
                              alert("학과, 계열을 선택해주세요");
                            }
                          })
                          .catch(error => {
                            alert(`학과 등록에 실패하였습니다.: ${error}`);
                          })
                          .finally(() => {
                            UserAPI.getProfile().then(response => {
                              UserStorage.setUserProfile(response.data);
                            });
                            setModyfyingFieldModal(false);
                            setSearchCategoryText("");
                            setSearchMajorText("");
                          });
                      }}
                    >
                      추가
                    </TextButton>
                  </View>
                </View>
              </View>
            </Modal>
            <TextButton
              style={{
                marginVertical: 20,
              }}
              onPress={() => {
                navigation.navigate("Mypage" as never);
              }}
            >
              저장
            </TextButton>
          </View>
        </Container>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  modifyingContainer: {
    flexDirection: "column",
    borderColor: "#D8E1EC",
    borderWidth: 3,
    borderRadius: 30,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  text: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  fieldtext: {
    fontSize: 16,
    // paddingVertical: 10,
    paddingHorizontal: 15,
  },
  childRow: {
    flexDirection: "row",
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
  modalFieldContainer: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    padding: 15,
  },
  modalInput: {
    width: "100%",
    paddingVertical: "5%",
    backgroundColor: "#D8E1EC",
  },
  modifyingBtn: {
    width: "25%",
    justifyContent: "flex-end",
    paddingLeft: 10,
  },
  modifyingFieldBtn: {
    width: "25%",
    justifyContent: "flex-end",
    paddingLeft: 10,
  },
  modalConfirmBtn: {
    width: "45%",
  },
  container: {
    flex: 1,
    backgroundColor: "skyblue",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  FlistContainer: {
    flex: 1,
  },
  MlistContainer: {
    flex: 1,
    marginBottom: 20,
    // paddingHorizontal: 40,
  },
  pressable: {
    padding: 10,
    borderRadius: 5,
  },
  pressablePressed: {
    backgroundColor: "skyblue",
  },

  myModalBtnDirection: {
    width: "100%",
    height: "14%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  myModalContainer: {
    // flex: 0.8,
    width: "90%",
    height: "80%",
    borderRadius: 25,
    backgroundColor: "#ffffff",
    padding: 15,
  },
  myModalBackground: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  myModalcategoryContainer: {
    // flex: 1,
    width: "100%",
    height: "43%",
    borderRadius: 25,
    backgroundColor: "#ffffff",
    padding: 15,
    flexDirection: "column",
  },
  myModalInput: {
    width: "100%",
    paddingVertical: "5%",
    paddingHorizontal: "5%",
    backgroundColor: "#D8E1EC",
    borderRadius: 25,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  myModalConfirmBtn: {
    width: 140,
    height: 50,
  },
});

export default ProfileModify;
