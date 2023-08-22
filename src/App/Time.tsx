const getCurrentTime = (targetDate: Date) => {
  const years = targetDate.getFullYear();
  const months = targetDate.getMonth();
  const dates = targetDate.getDate();
  const hours = targetDate.getHours();
  const minutes = targetDate.getMinutes();
  // 00 : 00 분으로 표시되게 바꿈
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const currentTime = `${years}/${months + 1}/${dates} ${formattedHours}:${formattedMinutes}`;
  return currentTime;
};

export default getCurrentTime;
