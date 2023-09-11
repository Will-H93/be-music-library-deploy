const deleteArtist = async (id) => {
  if (window.confirm("Do you really want to delete this artist?")) {
    const response = await fetch(`${window.location.origin}/artists/${id}`, { method: 'DELETE' });
  
    if (!response.ok) {
      window.alert('Oops: Something went wrong :(');
    } else {
      window.location.replace(`${window.location.origin}`);
    }
  }
};
