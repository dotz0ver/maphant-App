import {
  OLikeContentList,
  OtherUserData,
  OWriteBoardList,
  OWriteContentList,
} from "../../types/User";
import { dataResponse, GetAPI, statusResponse } from "../fetchAPI";

//프로필 닉네임, 소개글, 프로필 이미지 가져오는 부분, 상대방 id 필요
const readProfile = (otherUserId: number): Promise<dataResponse<OtherUserData>> =>
  GetAPI(`/profile?targetUserId=${otherUserId}`);

// 게시글 가져오는 부분, 상대방 id 필요
function bringBoardList(otherUserId: number) {
  return GetAPI<{ data: OWriteBoardList } & statusResponse>(
    `/profile/board?page=1&recordSize=100000&targetUserId=${otherUserId}`,
  );
}

//작성한 댓글 목록 가져오기
function writeContentList(otherUserId: number) {
  return GetAPI<{ data: OWriteContentList } & statusResponse>(
    `/profile/comment?page=1&targetUserId=${otherUserId}&recordSize=10`,
  );
}

//좋아요한 글 목록 가져오기
function likeBoardList(otherUserId: number) {
  return GetAPI<{ data: OLikeContentList } & statusResponse>(
    `/profile/like?page=1&targetUserId=${otherUserId}&recordSize=10`,
  );
}

export { bringBoardList, likeBoardList, readProfile, writeContentList };
