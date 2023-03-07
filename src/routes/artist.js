const express = require('express')
const { validateArtist } = require('../middleware/validator')
const { 
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  replaceArtist,
  destroyArtist
} = require('../controllers/artist')
const {
  createAlbum,
  getAlbums,
} = require('../controllers/album')

// STEP 3

// STEP 3a
// Import the multer middleware after setting it up in second step
// const upload = ...


const router = express.Router()

router
  .route('/')
  .post(validateArtist, createArtist)
  .get(getAllArtists)

router 
  .route('/:id')
  .get(getArtistById)
  .patch(updateArtist)
  .put(validateArtist, replaceArtist)
  .delete(destroyArtist)

// STEP 3b 
// Add the multer middleware to the albums create route
router
  .route('/:id/albums')
  .post(createAlbum) // Add it here and set the name of the file to 'cover_image'
  .get(getAlbums)

module.exports = router
