type BoardArticleBase = {
  title: string;
  body: string;
  userNickname?: string;
  likeCnt: number;
  commentCnt: number;
  createdAt: string;
  modifiedAt: string;
  isAnonymous: number;
  isHide: number;
  isLike: boolean;
};

//게시판 읽기
type BoardArticle = {
  categoryId: number;
  imagesUrl?: string[];
  tagNames?: string[];
  isComplete: number;
  parentId?: number;
  reportCnt: number;
  state: string;
  typeId: string;
  userId: number;
  boardId: number;
  id: number;
  tags?: hashTagType[];
} & BoardArticleBase;

//글 읽기
type BoardPost = {
  board: BoardArticle;
  answerList?: BoardArticle[]; //질문 게시판 답변
};

type BoardListItem = {
  boardId: number;
  userNickname: string;
} & BoardArticleBase;

type HotBoard = {
  boardId: number;
  userId: number;
  userNickname: string;
  typeId: number;
  type: string;
} & BoardArticleBase;

type VoteBoard = {
  boardId: number;
  userId: number;
  userNickname: string;
  typeId: number;
  type: string;
} & BoardArticleBase;

type BoardType = {
  id: number;
  name: string;
  postCnt: number;
};

type SortType = {
  id: number;
  name: string;
};

type ReportType = {
  id: number;
  name: string;
};

type commentType = {
  id: number;
  user_id: number;
  nickname: string;
  board_id: number;
  parent_id: number;
  body: string;
  is_anonymous: number;
  created_at: string;
  like_cnt: number;
  comment_id: number;
  time: string;
};

type hashTagType = {
  id: number;
  name: string;
};
export type {
  BoardArticle,
  BoardArticleBase,
  BoardListItem,
  BoardPost,
  BoardType,
  commentType,
  hashTagType,
  HotBoard,
  ReportType,
  SortType,
  VoteBoard,
};
