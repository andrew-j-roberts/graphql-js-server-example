import AWS from 'aws-sdk'
const S3Client = new AWS.S3()

export const getObject = ( dir, key ) => {
  return new Promise((resolve, reject) => {
    let params = {
      Bucket: 'ajr-data', // bucket name
      Key: `${key}` // path to the object 
    }
    S3Client.getObject(params, (err, data) => {
      if (err) reject(err) // handle any error and exit
      let file = {
        id: "HEY",
        content: data.Body.toString('ascii'),
        author: 'YAAAAAA'
      }
      resolve(file)
    })
  })
}