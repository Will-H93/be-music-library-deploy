async function postAlbum(event, artist_id) {
  event.preventDefault();

  const name = document.getElementById('albumNameField').value;
  const year = document.getElementById('albumYearField').value;
  const cover_image = document.getElementById('albumCoverField').files[0];

  const formData = new FormData();
  
  formData.append('name', name);
  formData.append('year', year);

  if (cover_image) {
    formData.append('cover_image', cover_image);
  }

  const response = await fetch(`http://${window.location.host}/artists/${artist_id}/albums`, {
      method: 'POST',
      body: formData
  })

  if (!response.ok) {
    window.alert('Oops: Something went wrong :(');
  } else {
    window.location.replace(`http://${window.location.host}/html/artist-profile.html?artistId=${artist_id}`);
  }
}