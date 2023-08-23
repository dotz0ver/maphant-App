import BoardDetail from "../App/Board/BoardDetail";
import Edit from "../App/Board/EditPost";
import Chatroom from "../App/Mail/Chatroom";
import Bookmark from "../App/Mypage/Bookmark";
import LikeContent from "../App/Mypage/LikeContent";
import Mycomment from "../App/Mypage/Mycomment";
import Mylike from "../App/Mypage/Mylike";
import Mypage from "../App/Mypage/Mypage";
import Mypost from "../App/Mypage/Mypost";
import PasswordCheck from "../App/Mypage/PasswordCheck";
import Profile from "../App/Mypage/Profile";
import ProfileModify from "../App/Mypage/ProfileModify";
import WriteBoard from "../App/Mypage/WriteBoard";
import WriteContent from "../App/Mypage/WriteContent";
import { BoardArticle } from "../types/Board";
import { RouteType } from "../types/Navigation";
import { OtherUserId } from "../types/User";

const Routes: RouteType[] = [
  {
    name: "Mypage",
    component: Mypage,
  },
  {
    name: "PasswordCheck",
    component: PasswordCheck,
  },
  {
    name: "ProfileModify",
    component: ProfileModify,
  },
  {
    name: "Mypost",
    component: Mypost,
  },
  {
    name: "BoardDetail",
    component: BoardDetail,
  },
  {
    name: "Bookmark",
    component: Bookmark,
  },
  {
    name: "Mycomment",
    component: Mycomment,
  },
  {
    name: "editPost",
    component: Edit,
  },
  // {
  //   name: "Profile",
  //   component: Profile,
  // },
  // {
  //   name: "WriteBoard",
  //   component: WriteBoard,
  // },
  // {
  //   name: "WriteContent",
  //   component: WriteContent,
  // },
  // {
  //   name: "LikeContent",
  //   component: LikeContent,
  // },
  // {
  //   name: "Chatroom",
  //   component: Chatroom,
  // },
  {
    name: "Mylike",
    component: Mylike,
  },
];

export type NavigationProp = {
  Mypage: undefined;
  PasswordCheck: undefined;
  ProfileModify: undefined;
  Mypost: BoardArticle[];
  detail: BoardArticle;
  Bookmark: undefined;
  WriteBoard: undefined;
  WriteContent: undefined;
  LikeContent: undefined;
  Chatroom: undefined;
};

export type { OtherUserId as OtherUserForm };
export default Routes;
