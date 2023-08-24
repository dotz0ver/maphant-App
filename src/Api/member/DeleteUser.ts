import { Alert } from "react-native";
import { DeleteAPI } from "../fetchAPI";

const deleteUser = (userID: number) => {
  DeleteAPI(`/user?userId=${userID}`).then(res => {
    if (res.success == true) {
      Alert.alert("회원탈퇴가 완료되었습니다.");
    }
  });
};

export default { deleteUser };
