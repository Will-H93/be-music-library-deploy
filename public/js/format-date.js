const formatDate = (dateString) => {
  const dateData = new Date(dateString);
  const dateTime = `${dateData.getHours()}:${dateData.getMinutes()}`;
  const date = `${dateData.getDate()}/${dateData.getMonth()}/${dateData.getFullYear()}`;

  return `${dateTime} ${date}`;
}