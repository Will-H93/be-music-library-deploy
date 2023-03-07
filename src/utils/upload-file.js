// STEP 4

// STEP 4a 
// Import the (already installed) 'aws-sdk' package and uncomment the s3 instance 

// const AWS = ...
// const s3 = new AWS.S3()

module.exports = async (file) => {
   // STEP 4b
   // Create a unique name for each file - you could achieve this is by using the uuidv4 npm module already installed
   // const fileName = ... 

   
   
   // STEP 4c
   // Retrieve the BUCKET_NAME and BUCKET_URL from env variables
   // const { BUCKET_NAME, BUCKET_URL } = ...

   
   
   // STEP 4d
   // Create request params for uploading the file to S3 by uncommenting the following line
   // const param = { Body: file.buffer, Bucket: BUCKET_URL, key: fileName};

   
   
   // STEP 4e
   // Attempt to upload file to S3
   // Use try catch and return the URL for the file to be saved into the database
}