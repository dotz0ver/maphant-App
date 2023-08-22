type TargetNickId = {
  id: number;
  nickname: string;
  roomId: number | undefined;
};
type MessageList = {
  id: number;
  last_content: string;
  other_id: number;
  other_nickname: string;
  receiver_id: number;
  receiver_is_deleted: boolean;
  sender_id: number;
  sender_is_deleted: boolean;
  time: Date;
  unread_count: number;
};
type ReceiveList = {
  content: string;
  id: number;
  is_me: boolean;
  is_read: boolean;
  room_id: number;
  time: Date;
  visible: string;
};

export type { MessageList, ReceiveList, TargetNickId };
