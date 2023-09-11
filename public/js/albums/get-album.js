const getAlbum = async (id) => {
  const response = await fetch(`${window.location.origin}/albums/${id}`);
  const data = await response.json();
  return data;
};