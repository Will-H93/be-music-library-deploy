const getAlbums = async (id) => {
  console.log("Calling get albums")
  const response = await fetch(`${window.location.origin}/artists/${id}/albums`);
  const data = await response.json();
  console.log(data);
  return data;
};