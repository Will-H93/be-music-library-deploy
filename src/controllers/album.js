const db = require('../db')
const { foreignKeyViolation } = require('../utils/postgres-errors')
// STEP 5 - Require upload-file js
// const uploadFile = require('../utils/upload-file')

const createAlbum = async (req, res) => {
  const { file } = req
  const { id } = req.params
  const { name, year } = req.body

  try {
    // STEP 6 - Upload image to S3 first, to retrieve the URL to store in the DB
    // const cover_image = await uploadFile(file)
    const { rows: [ album ] } = await db.query('INSERT INTO Albums (name, year, artist_id, cover_image) VALUES ($1, $2, $3, $4) RETURNING *', [name, year, id, cover_image])
    res.status(201).json(album)
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

