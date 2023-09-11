const getArtists = async () => {
  console.log("Calling get artists")
  const response = await fetch(`http://${window.location.host}/artists`);
  const data = await response.json();
  
  return data;
};