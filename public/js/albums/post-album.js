async function postAlbum(event, artist_id) {
  event.preventDefault();

  const name = document.getElementById('albumNameField').value;
  const year = document.getElementById('albumYearField').value;
  const cover_image = document.getElementById('albumCoverField').files[0];

  const formData = new FormData();
  
  formData.append('name', name);
  formData.append('year', year);

  let response;

  if (cover_image) {
    formData.append('cover_image', cover_image);
    response = await fetch(`http://${window.location.host}/artists/${artist_id}/albums`, {
      method: 'POST',
      body: formData
    });
  } else {
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    response = await fetch(`http://${window.location.host}/artists/${artist_id}/albums`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: jsonData
    });
  }

  if (!response.ok) {
    window.alert('Oops: Something went wrong :(');
  } else {
    window.location.replace(`http://${window.location.host}/html/artist-profile.html?artistId=${artist_id}`);
  }
}