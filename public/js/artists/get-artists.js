const getArtists = async () => {
  console.log("Calling get artists")
  const response = await fetch(`${window.location.origin}/artists`);
  const data = await response.json();
  
  return data;
};
