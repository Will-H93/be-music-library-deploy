async function postAlbum(event, artist_id) {
  event.preventDefault();

  const name = document.getElementById('albumNameField').value;
  const year = document.getElementById('albumYearField').value;
  var cover_image;
  if (document.body.contains(document.getElementById('albumCoverField')) && document.getElementById('albumCoverField').files.length > 0) {
    cover_image = document.getElementById('albumCoverField').files[0];
    console.log(cover_image);
  } else {
    console.log("No cover image");
  }
  
  const formData = new FormData();
  
  formData.append('name', name);
  formData.append('year', year);

  if(cover_image) {
    formData.append('cover_image', cover_image);
  }
  
  const response = await fetch(`${window.location.origin}/artists/${artist_id}/albums`, {
      method: 'POST',
      body: formData
  })

  if (!response.ok) {
    window.alert('Oops: Something went wrong :(');
  } else {
    window.location.replace(`${window.location.origin}/html/artist-profile.html?artistId=${artist_id}`);
  }
}
