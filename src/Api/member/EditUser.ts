import UserStorage from "../../storage/UserStorage";
import { PostAPI } from "../fetchAPI";
import UserAPI from "../memberAPI";

const getOldData = () => {
  PostAPI("/user/changeinfo/olddata").then(res => {
    if (res.success === true) {
      return res["data"];
    } else {
      console.log(res.errors);
      return;
    }
  });
  return console.log("서버 통신 오류");
};

const changePassword = (password: string, confirmPassword: string) => {
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
};

const changeNickname = (nickname: string) => {
  PostAPI("/user/changeinfo/nickname", {
    nickname: nickname,
  })
    .then(res => {
      if (res.success === true) {
        alert("닉네임이 변경되었습니다.");
        return;
      }
    })
    .catch(err => alert(err));
  UserAPI.getProfile().then(res => {
    UserStorage.setUserProfile(res.data);
  });
};

const changePhNum = (phoneNumber: string) => {
  PostAPI("/user/changeinfo/phnum", {
    phNum: phoneNumber,
  })
    .then(res => {
      if (res.success === true) {
        alert("핸드폰 번호가 변경되었습니다.");
        return;
      }
    })
    .catch(err => alert(err));
};

const addCategoryAndMajor = (category: string, major: string) => {
  PostAPI("/user/changeinfo/categorymajor", {
    category: category,
    major: major,
  })
    .then(res => {
      if (res.success === true) {
        alert("전공 - 계열이 추가되었습니다.");
        return;
      }
    })
    .catch(err => alert(err));
  UserAPI.getProfile().then(res => {
    UserStorage.setUserProfile(res.data);
  });
};

export default { getOldData, changePassword, changeNickname, changePhNum, addCategoryAndMajor };
