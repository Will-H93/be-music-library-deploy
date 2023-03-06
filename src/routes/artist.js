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

// STEP 2: Require multer middleware
const upload = require('../middleware/upload')


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

// STEP 2a: Add the multer middleware to the albums create route
router
  .route('/:id/albums')
  .post(createAlbum)
  .get(getAlbums)

module.exports = router
