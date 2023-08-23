import { MessageList, TargetNickId } from "../../types/DM";
import { DeleteAPI, GetAPI, PostAPI, statusResponse } from "../fetchAPI";

function SearchNickname(nickname: string) {
  return GetAPI<{ data: TargetNickId[] } & statusResponse>(`/dm/target/search`, { nickname });
}

function sendContent(receiver_id: number, content: string) {
  return PostAPI(`/dm`, {
    receiver_id,
    content,
  });
}

function receiveChatrooms() {
  return GetAPI<{ data: MessageList[] } & statusResponse>(`/room`);
}

function deleteChat(id: number) {
  return DeleteAPI(`/room/${id}`);
}
//cursor랑 limit 이건 어떻게 설정해줘야할지 몰라서  일단 때려박음
function chartLists(id: number | undefined, page: number) {
  return GetAPI(`/room/${id}?cursor=${page}&limit=20`);
}

export { chartLists, deleteChat, receiveChatrooms, SearchNickname, sendContent };
