const dateTimeFormat = (date: string): string => {
  const createdAtDate = new Date(date);
  const formattedDateTime = createdAtDate.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
  });
  return formattedDateTime;
};
const dateFormat = (date: string): string => {
  const createdAtDate = new Date(date);
  const formattedDateTime = createdAtDate.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formattedDateTime;
};

const formatTimeDifference = (targetDate: Date): string => {
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - targetDate.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (seconds < 60) {
    return `${seconds}초 전`;
  } else if (minutes < 60) {
    return `${minutes}분 전`;
  } else if (hours < 24) {
    return `${hours}시간 전`;
  } else if (days < 30) {
    return `${days}일 전`;
  } else {
    return `${months}개월 전`;
  }
};
export { dateFormat, dateTimeFormat, formatTimeDifference };
