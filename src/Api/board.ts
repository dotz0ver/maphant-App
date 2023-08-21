import { BoardArticle, BoardPost, commentType, HotBoard, VoteBoard } from "../types/Board";
import { dataResponse, DeleteAPI, GetAPI, PostAPI, PutAPI } from "./fetchAPI";

const listArticle = (
  boardType_id: number,
  page: number,
  recordSize: number,
  pageSize: number,
  sortCriterion: number,
): Promise<dataResponse<{ name?: string; list: BoardArticle[] }>> =>
  GetAPI(
    `/board/?boardTypeId=${boardType_id}&page=${page}&recordSize=${recordSize}&pageSize=${pageSize}&sortCriterionId=${sortCriterion}`,
  );

const listBoardType = (): Promise<dataResponse> => GetAPI<dataResponse>(`/board/boardType/`);

function boardPost(
  parentId: null | number,
  // categoryId: number,
  // userId: number,
  typeId: number,
  title: string,
  body: string,
  isHide: number,
  isComplete: number,
  isAnonymous: number,
  imagesUrl?: string[],
  poll?: { title: string; options: string[] },
  tagNames?: string[],
) {
  return PostAPI(`/board/create/`, {
    parentId,
    // categoryId,
    // userId,
    typeId,
    title,
    body,
    isHide,
    isComplete,
    isAnonymous,
    imagesUrl,
    poll,
    tagNames,
  });
}

const listVoteBoardTotal = (
  page: number,
  recordSize: number,
): Promise<dataResponse<{ list: VoteBoard[] }>> =>
  GetAPI(`/board/poll?page=${page}&recordSize=${recordSize}`);

const listVoteBoard = (
  boardType_id: number,
  page: number,
  recordSize: number,
): Promise<dataResponse<{ list: VoteBoard[] }>> =>
  GetAPI(`/board/poll?boardTypeId=${boardType_id}&page=${page}&recordSize=${recordSize}`);

const listHotBoardTotal = (
  page: number,
  recordSize: number,
): Promise<dataResponse<{ list: HotBoard[] }>> =>
  GetAPI(`/board/hot?page=${page}&recordSize=${recordSize}`);

const listHotBoard = (
  boardType_id: number,
  page: number,
  recordSize: number,
): Promise<dataResponse<{ list: HotBoard[] }>> =>
  GetAPI(`/board/hot?boardTypeId=${boardType_id}&page=${page}&recordSize=${recordSize}`);

function boardEdit(id: number, title: string, body: string, isHide: number, tags?: string[]) {
  return PutAPI(`/board/update/`, {
    id,
    title,
    body,
    isHide,
    tags,
  });
}

const boardComplete = (questId: number, answerId: number): Promise<dataResponse> =>
  PostAPI<dataResponse>(`/board/complete/?questId=${questId}&answerId=${answerId}`);

const boardDelete = (board_id: number): Promise<dataResponse> =>
  DeleteAPI<dataResponse>(`/board/${board_id}/`);

const getArticle = (board_id: number): Promise<dataResponse<BoardPost>> =>
  GetAPI<dataResponse<BoardPost>>(`/board/${board_id}/`);

function insertLikePost(board_id: number) {
  return PostAPI(`/board/like/${board_id}/`);
}

function deleteLikeBoard(board_id: number) {
  return DeleteAPI(`/board/like/${board_id}/`);
}

function searchArticle(content: string, boardType_id: number) {
  return GetAPI(`/board/search/?content=${content}&boardTypeId=${boardType_id}`);
}
function bookMarkArticle(board_id: number) {
  return PostAPI(`/bookmark/${board_id}`);
}
function DeletebookMarkArticle(board_id: number) {
  return DeleteAPI(`/bookmark/${board_id}`);
}
function ImageUpload(formData: FormData) {
  return PostAPI(`/image`, formData);
}
const listReportType = (): Promise<dataResponse> => GetAPI<dataResponse>(`/report/list`);
function ReportPost(board_id: number, reportType_id: number) {
  return PostAPI(`/board/report/?boardId=${board_id}&reportId=${reportType_id}`, {
    board_id,
    reportType_id,
  });
}

const commentReportType = (): Promise<dataResponse> => GetAPI<dataResponse>(`/report/list`);
function ReportComment(commentId: number, reportId: number) {
  return PostAPI(`/comment/report`, {
    commentId,
    reportId,
  });
}

const listSortCriterion = (): Promise<dataResponse> =>
  GetAPI<dataResponse>(`/board/sortCriterion/`);

const commentArticle = (
  board_id: number,
  page: number,
  recordSize: number,
): Promise<dataResponse<{ list: commentType[] }>> =>
  GetAPI(`/comment/list/${board_id}?page=${page}&recordSize=${recordSize}`);

const commentInsert = (
  board_id: number,
  body: string,
  is_anonymous: number,
): Promise<dataResponse> =>
  PostAPI<dataResponse>(`/comment/insert`, {
    board_id,
    body,
    is_anonymous,
  });

const commentDelete = (id: number): Promise<dataResponse> =>
  DeleteAPI<dataResponse>(`/comment/${id}`);

const commentUpdate = (id: number, body: string): Promise<dataResponse> =>
  PostAPI(`/comment/update`, { id, body });

const commentReply = (
  parent_id: number,
  board_id: number,
  body: string,
  is_anonymous: number,
): Promise<dataResponse> =>
  PostAPI<dataResponse>(`/comment/insert`, {
    parent_id,
    board_id,
    body,
    is_anonymous,
  });

const commentLike = (userId: number, commentId: number): Promise<dataResponse> =>
  PostAPI<dataResponse>(`/comment/like`, { userId, commentId });

const commentLikeCnt = (comment_id: number): Promise<dataResponse> =>
  GetAPI<dataResponse>(`/comment/cnt-like/${comment_id}`);

const doPoll = (pollId: number, pollOptionId: number): Promise<dataResponse> =>
  // @ts-ignore
  PostAPI<dataResponse>(`/poll/${pollId}`, pollOptionId);

const postPoll = (title: string, options: string[]): Promise<dataResponse> =>
  PostAPI<dataResponse>(`/board/poll/`, {
    title,
    options,
  });

const closePoll = (board_id: number): Promise<dataResponse> =>
  PostAPI<dataResponse>(`/poll/close/board/${board_id}`);

const boardClosePoll = (poll_id: number): Promise<dataResponse> =>
PostAPI<dataResponse>(`/poll/close/${poll_id}`);

const deletePoll = (board_id: number): Promise<dataResponse> =>
  DeleteAPI<dataResponse>(`/poll/board/${board_id}`);

const boardDeletePoll = (poll_id: number): Promise<dataResponse> =>
DeleteAPI<dataResponse>(`/poll/${poll_id}`);

const pollStatus = (poll_id: number): Promise<dataResponse> =>
  GetAPI<dataResponse>(`/poll/my-poll/${poll_id}`);

const boardPollStatus = (board_id: number): Promise<dataResponse> =>
  GetAPI<dataResponse>(`/poll/board/${board_id}`);

const getPollId = (board_id: number): Promise<dataResponse<{ poll_id: number }>> =>
  GetAPI(`/poll/${board_id}`);

export {
  boardClosePoll,
  boardComplete,
  boardDelete,
  boardDeletePoll,
  boardEdit,
  boardPollStatus,
  boardPost,
  bookMarkArticle,
  closePoll,
  commentArticle,
  commentDelete,
  commentInsert,
  commentLike,
  commentLikeCnt,
  commentReply,
  commentReportType,
  commentUpdate,
  DeletebookMarkArticle,
  deleteLikeBoard,
  deletePoll,
  doPoll,
  getArticle,
  getPollId,
  ImageUpload,
  insertLikePost,
  listArticle,
  listBoardType,
  listHotBoard,
  listHotBoardTotal,
  listReportType,
  listSortCriterion,
  listVoteBoard,
  listVoteBoardTotal,
  pollStatus,
  postPoll,
  ReportComment,
  ReportPost,
  searchArticle,
};
