const getArtist = async (id) => {
  const response = await fetch(`http://${window.location.host}/artists/${id}`);
  const data = await response.json();
  return data;
};