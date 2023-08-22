import { Field, Formik } from "formik";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import * as Yup from "yup";

import { newPassword } from "../../Api/member/signUp";
import { Container, Spacer, TextButton } from "../../components/common";
import ConfirmEmail from "../../components/Member/ConfirmEmail";
import CustomInput from "../../components/Member/CustomInput";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .matches(/\w*[a-z]\w*/, "비밀번호에는 소문자가 포함되어야 합니다.")
    .matches(/\w*[A-Z]\w*/, "비밀번호에는 대문자가 포함되어야 합니다.")
    .matches(/\d/, "비밀번호에는 숫자가 포함되어야 합니다.")
    .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "비밀번호에는 특수문자가 포함되어야 합니다.")
    .required("필수 정보입니다.")
    .min(8, ({ min }) => `비밀번호는 최소 ${min}자 이상이어야 합니다.`),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("필수 정보입니다."),
});

const Find: React.FC = () => {
  const [email, setEmail] = useState("");
  const [authcode, setAuthcode] = useState("");

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      onSubmit={async values => {
        await newPassword(email, values.password, values.confirmPassword).then(result => {
          if (result.success) {
            alert("비밀번호가 변경되었습니다.");
            //라우터 넣으면 됨
          }
          // console.log(result);
        });
      }}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => (
        <Container
          isForceKeyboardAvoiding={true}
          paddingHorizontal={40}
          paddingVertical={80}
          style={{ backgroundColor: "white" }}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.pwFont}>비밀번호 찾기</Text>
            <ConfirmEmail
              onEmailChange={setEmail}
              onAuthcodeChange={setAuthcode}
              email={email}
              authcode={authcode}
            />
            <Field placeholder="비밀번호" name="password" component={CustomInput} secureTextEntry />
            <Spacer size={10} />
            <Field
              placeholder="비밀번호 확인"
              name="confirmPassword"
              component={CustomInput}
              secureTextEntry
            />
            <Spacer size={20} />
            <TextButton fontSize={16} onPress={handleSubmit}>
              비밀번호 변경하기
            </TextButton>
          </ScrollView>
        </Container>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  pwFont: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Find;
