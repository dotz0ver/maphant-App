import BoardDetail from "../App/Board/BoardDetail";
import BoardList, { BoardType } from "../App/Board/BoardList";
import Edit from "../App/Board/editPost";
import DetailList from "../App/Board/List";
import Post from "../App/Board/Post";
import QA_answer from "../App/Board/QA_answer";
import QAdetail from "../App/Board/QAdetail";
import QnABoard from "../App/Board/QnAList";
import TotalList from "../App/Board/TotalList";
import VoteTotalList from "../App/Board/VoteTotalList";
import Profile from "../App/Mypage/Profile";
import { BoardArticle } from "../types/Board";
import { RouteType } from "../types/Navigation";

const Routes: RouteType[] = [
  {
    name: "BoardList",
    component: BoardList,
  },
  {
    name: "QnABoard",
    component: QnABoard,
  },
  {
    name: "DetailList",
    component: DetailList,
  },
  {
    name: "QnAdetail",
    component: QAdetail,
  },
  {
    name: "BoardDetail",
    component: BoardDetail,
  },
  {
    name: "Post",
    component: Post,
  },
  {
    name: "editPost",
    component: Edit,
  },
  {
    name: "QA_answer",
    component: QA_answer,
  },
  {
    name: "HotBoard",
    component: TotalList,
  },
  {
    name: "VoteBoard",
    component: VoteTotalList,
  },
  {
    name: "Profile",
    component: Profile,
  },
];

export type NavigationProp = {
  BoardList: undefined;
  QnABoard: { boardType: BoardType };
  DetailList: { boardType: BoardType };
  BoardDetail: { id: number; preRender?: BoardArticle };
  QnAdetail: { id: number; preRender?: BoardArticle };
  Post: { boardType: BoardType };
  editPost: { post: BoardArticle };
  QA_answer: { id: number; preRender?: BoardArticle };
  HotBoard: undefined;
  VoteBoard: undefined;
};

export default Routes;
