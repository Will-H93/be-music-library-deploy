const getAlbum = async (id) => {
  const response = await fetch(`http://${window.location.host}/albums/${id}`);
  const data = await response.json();
  return data;
};