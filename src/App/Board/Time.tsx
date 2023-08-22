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

export { dateFormat, dateTimeFormat };
