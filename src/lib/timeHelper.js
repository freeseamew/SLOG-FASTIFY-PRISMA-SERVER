
const getFormatDate = (date) => {
  let year = date.getFullYear();
  let month = (1 + date.getMonth());
  month = month >= 10 ? month : '0' + month;
  let day = date.getDate();
  day = day >= 10 ? day : '0' + day;
  const result = `${year}-${month}-${day}`
  return result;
}

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
  // return new Date(year, month, today, hours, minutes, seconds, milliseconds);
}

export {
  getFormatDate,
  getCurrentDate
}