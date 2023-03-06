async function postArtist(event) {
  console.log("EVENT:", event)
  event.preventDefault();

  const name = document.getElementById('artistNameField').value;
  const genre = document.getElementById('artistGenreField').value;

  console.log(name, genre);

  const formData = new FormData();

  formData.append('name', name);
  formData.append('genre', genre);

  const jsonData = JSON.stringify(Object.fromEntries(formData));
  console.log("JSON:", jsonData)

  const response = await fetch(`http://${window.location.host}/artists`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: jsonData
  })

  const responseBody = await response.json()
  console.log(response)
  if (!response.ok) {
    window.alert('Oops: Something went wrong :(');
  } else {
    window.location.replace(`http://${window.location.host}/html/profile.html?artistId=${responseBody.id}`);
  }
}