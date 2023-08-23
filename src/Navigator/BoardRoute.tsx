import BoardDetail from "../App/Board/BoardDetail";
import BoardList, { BoardType } from "../App/Board/BoardList";
import Edit from "../App/Board/EditPost";
import HotDetailList from "../App/Board/HotList";
import DetailList from "../App/Board/List";
import Post from "../App/Board/Post";
import QA_answer from "../App/Board/QA_answer";
import QAdetail from "../App/Board/QAdetail";
import QnABoard from "../App/Board/QnAList";
import TotalList from "../App/Board/TotalList";
import VoteDetailList from "../App/Board/VoteList";
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
    name: "HotDetailList",
    component: HotDetailList,
  },
  {
    name: "VoteBoard",
    component: VoteTotalList,
  },
  {
    name: "VoteDetailList",
    component: VoteDetailList,
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
  HotDetailList: undefined;
  VoteDetailList: undefined;
};

export default Routes;
