import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Field, Formik, FormikErrors } from "formik";
import React, { useCallback } from "react";
// import { SearchBar } from "@rneui/themed";
import { FlatList } from "react-native-gesture-handler";
import * as Yup from "yup";

import {
  signup,
  universityList,
  validateEmail,
  validateNickname,
  validatePassword,
} from "../../Api/member/signUp";
import { Container, Spacer, TextButton } from "../../components/common";
import SearchByFilter from "../../components/Input/SearchByFilter";
import CustomInput from "../../components/Member/CustomInput";
import UIStore from "../../storage/UIStore";
import { ISignupForm } from "../../types/SignUp";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/,
      "학교 이메일 형식으로 입력해주세요(.ac.kr 또는 .edu)",
    )
    .required("학교 이메일 형식으로 입력해주세요(.ac.kr 또는 .edu)")
    .test((value, testContext) =>
      validateEmail(value)
        .then(() => {
          return true;
        })
        .catch(err => {
          return testContext.createError({ message: err });
        }),
    ),
  password: Yup.string()
    .matches(/\w*[a-z]\w*/, "비밀번호에는 소문자가 포함되어야 합니다.")
    .matches(/\w*[A-Z]\w*/, "비밀번호에는 대문자가 포함되어야 합니다.")
    .matches(/\d/, "비밀번호에는 숫자가 포함되어야 합니다.")
    .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "비밀번호에는 특수문자가 포함되어야 합니다.")
    .required("필수 정보입니다.")
    .min(8, ({ min }) => `비밀번호는 최소 ${min}자 이상이어야 합니다.`)
    .required("영문 대, 소문자, 숫자, 특수문자 1개 이상 으로 구성된 8자 이상으로 입력해주세요.")
    .test((value, testContext) => {
      return validatePassword(value)
        .then(() => {
          return true;
        })
        .catch(err => testContext.createError({ message: err }));
    }),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("필수 정보입니다."),
  // phoneNumber: Yup.string().matches(/^\d{3}-\d{4}-\d{4}$/, "000-0000-0000 형식으로 입력해주세요."),
  nickname: Yup.string()
    // .matches(/^[a-zA-Z0-9가-힣_-]{3,20}$/, "닉네임은 3자 이상 20자 이하이어야 합니다.")
    .required("필수 정보입니다.")
    .test(async (value, testContext) => {
      return validateNickname(value)
        .then(() => {
          return true;
        })
        .catch(err => testContext.createError({ message: err }));
    }),
  studentNumber: Yup.string().required("필수 정보입니다."),
  university: Yup.string().required("필수 정보입니다."),
});

let debounce_lastTime = Date.now();
let debounce_timer: string | number | NodeJS.Timeout | undefined;

function debounce(func: () => void, delay = 500) {
  const now = Date.now();
  debounce_timer && clearTimeout(debounce_timer);

  if (now - debounce_lastTime < delay) {
    debounce_timer = setTimeout(() => {
      debounce(func, delay);
    }, delay);

    return;
  }

  debounce_lastTime = now;
  func();
}

function saveInput() {
  console.log("Saving data to the server");
}

const processChange = () => debounce(() => saveInput());
const Signup = () => {
  // const [loading, setLoading] = useState<Boolean>(false);
  const SignupForm: ISignupForm = {
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    name: "",
    university: "",
    studentNumber: "",
  };

  const navigation = useNavigation<NavigationProp<{ Confirm: ISignupForm }>>();
  const onSubmit = useCallback(async (errors: FormikErrors<ISignupForm>, next: () => void) => {
    const keys = Object.keys(errors);
    if (keys.length == 0) return next();

    // Toast.show("회원가입 정보를 확인해 주세요.");
  }, []);
  const placeholderTextColor = "#636363";

  const getFieldPlaceholder = (fieldName: string) => {
    switch (fieldName) {
      case "email":
        return "이메일";
      case "password":
        return "비밀번호";
      case "confirmPassword":
        return "비밀번호 확인";
      case "nickname":
        return "닉네임";
      case "name":
        return "이름";
      case "phoneNumber":
        return "전화번호";
      case "studentNumber":
        return "학번";
      case "university":
        return "학교 검색";
      default:
        return "";
    }
  };

  return (
    <Container isForceKeyboardAvoiding={true} style={{ backgroundColor: "white" }}>
      <Formik
        validateOnChange
        initialValues={SignupForm}
        validationSchema={validationSchema}
        onSubmit={async values => {
          UIStore.showLoadingOverlay();
          await signup(values)
            .then(() => {
              return navigation.navigate("Confirm", values);
            })
            .catch(error => {
              alert(`회원가입 실패: ${error}\n다시 시도해주세요.`);
            })
            .finally(() => {
              UIStore.hideLoadingOverlay();
            });
        }}
      >
        {({ handleSubmit, errors }) => (
          <Container
            style={{
              flex: 1,
              backgroundColor: "#fff",
              justifyContent: "center",
              paddingHorizontal: 30,
            }}
          >
            <FlatList
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ backgroundColor: "white" }}
              data={Object.keys(SignupForm)} // 각 필드 키를 배열로 전달
              renderItem={({ item }) => (
                <>
                  <Field
                    placeholder={getFieldPlaceholder(item)}
                    name={item}
                    component={item === "university" ? SearchByFilter : CustomInput}
                    onKeyPress={processChange}
                    list={item === "university" ? universityList : undefined}
                    secureTextEntry={item === "password" || item === "confirmPassword"}
                    placeholderTextColor={placeholderTextColor}
                  />
                  <Spacer size={10} />
                </>
              )}
              keyExtractor={item => item}
              ListFooterComponent={
                <Container
                  style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    paddingHorizontal: 30,
                  }}
                >
                  <Spacer size={40} />
                  <TextButton
                    style={{
                      opacity: Object.keys(errors).length > 0 ? 0.5 : 1,
                    }}
                    backgroundColor="#5299EB"
                    fontColor="white"
                    paddingHorizontal={20}
                    paddingVertical={15}
                    borderRadius={30}
                    fontSize={18}
                    disabled={Object.keys(errors).length > 0}
                    onPress={() => onSubmit(errors, handleSubmit)}
                  >
                    회원가입
                  </TextButton>
                  <Spacer size={50} />
                </Container>
              }
            />
          </Container>
        )}
      </Formik>
    </Container>
  );
};

export default Signup;
