const db = require('../db')
const { foreignKeyViolation } = require('../utils/postgres-errors')
// STEP 5
// STEP 5a - Require upload-file js created at STEP 4
// const uploadFile = ...

const createAlbum = async (req, res) => {
  const { file } = req
  const { id } = req.params
  const { name, year, cover_image } = req.body

  try {
    // STEP 5b - Upload image to S3 first, to retrieve the URL to store in the DB
    // const cover_image = ...

    const { rows: [ album ] } = await db.query('INSERT INTO Albums (name, year, artist_id, cover_image) VALUES ($1, $2, $3, $4) RETURNING *', [name, year, id, cover_image])
    res.status(201).json(album)
  } catch (err) {
    switch (err.code) {
    case foreignKeyViolation:
      res.status(404).json({ message: `artist ${id} does not exist` })
      break
    default:
      console.log(err.message);
      res.status(500).json(err.message)
      break
    }
  }
}

const getAlbums = async (req, res) => {
  const { id } = req.params

  try {
    const { rows } = await db.query('SELECT * FROM Albums WHERE artist_id = $1', [ id ])
    res.status(200).json(rows)
  } catch (err) {
    switch (err.code) {
    case foreignKeyViolation:
      res.status(404).json({ message: `artist ${id} does not exist` })
      break
    default:
      res.status(500).json(err.message)
      break
    }
  }
} 

module.exports = { createAlbum, getAlbums }

