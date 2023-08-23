type UserCategory = {
  categoryId: number;
  categoryName: string;
  majorId: number;
  majorName: string;
};

type UserData = {
  id: number;
  email: string;
  name: string;
  nickname: string;
  role: string;
  category: UserCategory[];
};

// 상대방 소개글, 프로필 이미지, 닉네임
type OtherUserData = {
  nickname: string;
  body: string;
  profileImg: string;
  category: string;
  categoryId: number;
  categoryName: string;
  majorId: number;
  majorName: string;
};

type OtherUserId = {
  id: number;
};

type OWriteBoardList = {
  body: string;
  category_id: number;
  comment_cnt: number;
  created_at: Date;
  id: number;
  images_url: string[];
  isLike: boolean;
  is_anonymous: boolean;
  is_complete: boolean;
  is_hide: number;
  like_cnt: number;
  modified_at: string;
  report_cnt: number;
  title: string;
  type: string;
  user_id: number;
};

type Pagination = {
  endPage: number;
  existNextPage: boolean;
  existPrevPage: boolean;
  limitStart: number;
  startPage: number;
  totalPageCount: number;
  totalRecordCount: number;
};

type OWriteContentList = {
  id: number;
  parent_id: string;
  user_id: number;
  nickname: string;
  board_id: number;
  board_title: string;
  body: string;
  is_anonymous: boolean;
  created_at: Date;
  modified_at: string;
  like_cnt: number;
  commnet_id: number;
};

type OLikeContentList = {
  id: number;
  category_id: number;
  user_id: number;
  type: string;
  title: string;
  body: string;
  is_hide: number;
  is_conplete: boolean;
  is_anoymous: boolean;
  created_at: Date;
  modified_at: string;
  comment_cnt: number;
  like_cnt: number;
  report_cnt: number;
  images_url: string;
  isLike: boolean;
};
export type {
  OLikeContentList,
  OtherUserData,
  OtherUserId,
  OWriteBoardList,
  OWriteContentList,
  Pagination,
  UserCategory,
  UserData,
};
