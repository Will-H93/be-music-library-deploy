const getArtist = async (id) => {
  const response = await fetch(`${window.location.origin}/artists/${id}`);
  const data = await response.json();
  return data;
};
