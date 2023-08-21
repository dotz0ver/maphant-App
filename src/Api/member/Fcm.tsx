import { fcmList } from "../../types/Fcm";
import { dataResponse, GetAPI, PostAPI } from "../fetchAPI";

const sendFcm = (token: string) => {
  return PostAPI(`/fcm/token`, {
    token,
  });
};
const notificationsList = (
  page: number,
  recordSize: number,
): Promise<dataResponse<{ list: fcmList[] }>> => {
  return GetAPI(`/notifications/?page=${page}&recordSize=${recordSize}0&pageSize=100`);
};

export { notificationsList, sendFcm };
