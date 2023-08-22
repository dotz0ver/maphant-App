import BoardDetail from "../App/Board/BoardDetail";
import Chatroom from "../App/Mail/Chatroom";
import Mail from "../App/Mail/Mail";
import SearchUser from "../App/Mail/SearchUser";
import Profile from "../App/Mypage/Profile";
import WriteBoard from "../App/Mypage/WriteBoard";
import WriteContent from "../App/Mypage/WriteContent";
import { TargetNickId } from "../types/DM";
import { RouteType } from "../types/Navigation";

const Routes: RouteType[] = [
  {
    name: "Mail",
    component: Mail,
  },
  {
    name: "Chatroom",
    component: Chatroom,
  },
  {
    name: "SearchUser",
    component: SearchUser,
  },
  {
    name: "Profile",
    component: Profile,
  },
  {
    name: "WriteBoard",
    component: WriteBoard,
  },
  {
    name: "BoardDetail",
    component: BoardDetail,
  },
  {
    name: "WriteContent",
    component: WriteContent,
  },
];

export type NavigationProp = {
  Mail: undefined;
  Chatroom: TargetNickId;
  SearchUser: undefined;
};

export type { TargetNickId as MailFormParams };
export default Routes;
