# Music Library - Postgres - Cover Images

A UI for the Music Library

## Running the app

This app requires a Postgres database. Connection details should be stored in a `.env` file:

```bash
DB_NAME=music_library
DB_HOST=localhost
DB_PASSWORD=password
DB_USER=postgres
DB_PORT=5432
```

Clone this repo and install dependencies:

```bash
git clone 
cd be-music-library-cover-image-demo
npm install
npm start
```

# Album Cover Challenge

# Saving files to an online service

This is the example code for the `Uploading Files` lecture.

The completed example is viewable on the `solution` branch.

## Setting Up

Clone this repo, and use `npm install` to install dependancies. You will need a `Postgres` instance for data storage. You can start one inside a docker container with:

```bash
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres
```

You will also need to create a `.env` file with your database connection details. Example ones are given in `.env.example`.

Run the app with `npm start`. By default the app is served on `localhost:3000`. Visiting this location in your browser will display the artists page. Feel free to create a couple of artists.

Currently, the upload form does not work when adding a cover image. This is because the app is not set up to handle image uploads. 

## AWS

Before we can upload files, we need a place to store them. We will be using `S3` (Simple Storage Solution) on `AWS` (Amazon Web Services). To do this, you will need an AWS account.

Sign up for an AWS account [here](https://portal.aws.amazon.com/billing/signup?nc2=h_ct&src=default&redirect_url=https%3A%2F%2Faws.amazon.com%2Fregistration-confirmation#/start). You will need a payment card, but new accounts get access to a free tier for one year, and many services have a permanent free tier.

Once you have your root login, use this [guide](https://docs.aws.amazon.com/mediapackage/latest/ug/setting-up-create-iam-user.html) to create an administrator account for yourself. This is the account you should use to access AWS from now on. Store your root user credentials somewhere secure. 

### S3

Use [this guide](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/create-bucket.html) to set up a new S3 bucket. Make sure to uncheck the boxes that block public access.

Next we'll configure the bucket so that anybody can read the files that are in there, but only we can upload.

In a web-browser, sign in to the AWS console and select the S3 section. Select the appropriate bucket and click the Permissions tab. A few options are now provided on this page (including Block public access, Access Control List, Bucket Policy, and CORS configuration).

You will need to configure the bucket’s CORS (Cross-Origin Resource Sharing) settings, which will allow your application to access content in the S3 bucket. Each rule should specify a set of domains from which access to the bucket is granted and also the methods and headers permitted from those domains.

For this to work in your application, click ‘Edit’ and enter the following JSON for the bucket’s CORS settings:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "HEAD",
            "POST",
            "PUT"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```

Click `Save changes` and close the editor.

This tells S3 to allow any domain access to the bucket and that requests can contain any headers, which is generally fine for testing. When deploying, you should change the ‘AllowedOrigin’ to only accept requests from your domain.

### Bucket Policy

Next, we will need to write a `policy` for the bucket. This will allow your front-end to access the images stored in your bucket, and prevent files being uploaded without permission. Copy the following into the `bucket policy` section of the `permissions` page (make sure to add your bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "music-library-public-read",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::[YOUR BUCKET NAME HERE]/*"
        }
    ]
}
```

### Bucket User

Now we will need to create a new user for your API to be able to upload images to your bucket. The process for this is similar to how we set up our admin account, but in this case the account will have a lot fewer permissions. 
- ⚠️ Make sure to download the user access keys and store them somewhere safe. 
- ⚠️ THESE SHOULD NOT BET COMMITTED TO GIT!

For starters, the account should be enabled for `programatic access` only. This means that the credentials can not be used to access the admin console, thus making life harder for anybody who might get their hands on them.

Now we will make a policy for the user. This sets what the user is allowed to do withing our AWS account. We do this by giving permission, rather than taking it away, so new users in our account aren't allowed to do anything by default. 

In our app user summary, click on permissions, and then click `Add permissions`. Click `Add existing policies directly` and then click `Create policy`.

In the visual editor:

- Select `S3` as the `service`
- In `actions`, select `putObject` from the `write` dropdown.
- In `resources` set the access to `specific` and then click `add ARN`, set the `bucket name` for your bucket, and set the `object` to any

Click `Review policy`, it should look something like this:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::[YOUR_BUCKET_NAME_HERE]/*"
        }
    ]
}
```
And with that, we have our S3 bucket created and the right permissions for the user which will upload files to it. 

## Updating the Music Library Project

All the required packages and dependencies for this practical have already been installed. We recommend you familiarise yourself with the documentation before proceeding:
- `aws-sdk` - https://github.com/aws/aws-sdk-js 
- `multer` - https://github.com/expressjs/multer
- `uuidv4` - https://github.com/thenativeweb/uuidv4 

# Step 1 - Finishing our config

Once we have the app user keys and bucket details, we can add them to add the `.env`:

```bash
BUCKET_NAME=[BUCKET_NAME]
BUCKET_URL=https://[BUCKET_NAME].s3-[BUCKET_REGION].amazonaws.com
AWS_ACCESS_KEY_ID=[APP_USER_KEY]
AWS_SECRET_ACCESS_KEY=[APP_USER_SECRET]
```

### Step 2 - Multer

Multer is a middleware which lets us handle `multipart/form-data`. This is the content-type we use to send files in http request. 

To use it, we need to set up where to store the files sent to our API. Since we don't expect a lot of users, we could temporarily store the images in memory. We will handle the final storage ourselves.

```js
// src/middlewares/upload.js
// ...
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
  });
// ...
```

### Step 3 - Using multer
Next, we need to add our `upload` to our middlware chain:

```js
// src/routes/artist.js
// ...

router
  .route('/:id/albums')
  .post(upload.single('cover_image'), createAlbum) 
  .get(getAlbums)

// ...
```

This tells multer to look in our `request` for a property matching the string we give it. In this case that is `cover_image`. This then becomes accessible as `req.file`. 

### Step 4 - Using AWS-SDK S3 to upload the file

The `aws-sdk` (software development kit) give us access to methods that let us interact with AWS services. To use it, we will need to require it in our controller, and then use it to create a `new AWS.S3()`:

```js
// src/utils/upload-file.js
// ...

const AWS = require('aws-sdk');

const s3 = new AWS.S3();

// ...
```

We can now use our `s3` object to write a function to upload our file to s3. We can break this down in smaller steps:
1. Use `uuidv4` package to create unique names for our files, so we don't override files.
    - Make sure to import it at the top (and yes it's already installed!) `const { uuid } = require('uuidv4')`
2. Retrieve the `BUCKET_NAME` and `BUCKET_URL` env variables that you set up previously.
3. Set the params object of the request to make to the S3 bucket we set up:
    - `Body` - this will be the `file.buffer`. 
    - `Bucket` - this will be the BUCKET_NAME where we want to store the file
    - `key` - the unique filename we generated previously
4. In a try/catch - attempt to `putObject()` and return the file url, which will be a made of the BUCKET_URL and the BUCKET_Name. 
5. Handle potential errors in the catch branch.

```js
// src/app.js
module.exports = async (file) => {
  const fileName = uuid()

  const { BUCKET_NAME, BUCKET_URL } = process.env

  const params = {
    Body: file.buffer,
    Bucket: BUCKET_NAME,
    Key: fileName
  }

  try {
    await s3.putObject(params).promise()
    return `${BUCKET_URL}/${fileName}`
  } catch (err) {
    console.log(err)
  }
}
```

Note that `AWS-SDK` methods can return a `promise`, so in this case we are wrapping the function in a try/catch. This will help keep our code readable.

Now we need to change our controller to use our `uploadFile` function, before saving the rest of our post to the database:

```js
// src/controllers/album.js

const uploadFile = require('../utils/upload-file')

...
const createAlbum = async (req, res) => {
  const { file } = req
  const { id } = req.params
  const { name, year } = req.body

  try {
    const cover_image = await uploadFile(file)
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
...
```

Here we are calling our `uploadFile` function, which saves the file to the bucket, and sets a UUID as the file name. Next it returns the `cover_image`, which we then add to our `req.body` and then feed into our `createItem` query function.

If everything has worked, we should be able to use the Music Library UI page to create a new album with a album cover image, and then view it at `http://localhost:3000`.

## Next Steps

- There is currently no authenticaton required to upload images. If you want to deploy this as an app, then you should add a password middleware to your `create`, `update` and `delete` routes.

