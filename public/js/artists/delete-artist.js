const deleteArtist = async (id) => {
  if (window.confirm("Do you really want to delete this artist?")) {
    const response = await fetch(`http://${window.location.host}/artists/${id}`, { method: 'DELETE' });
  
    if (!response.ok) {
      window.alert('Oops: Something went wrong :(');
    } else {
      window.location.replace(`http://${window.location.host}/`);
    }
  }
};