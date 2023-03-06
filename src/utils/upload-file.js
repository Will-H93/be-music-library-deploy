const AWS = require('aws-sdk')

const s3 = new AWS.S3()

module.exports = (file) => new Promise((resolve, reject) => {
  // STEP 4 - Write the function to upload the received file to S3
})