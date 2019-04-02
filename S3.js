import AWS from 'aws-sdk'
const S3Client = new AWS.S3()

export const getObject = ( bucketName, key ) => {
  return new Promise((resolve, reject) => {
    let params = {
      Bucket: bucketName, 
      Key: key
    }
    S3Client.getObject(params, (err, data) => {
      if (err) reject(err) // handle any error and exit
      let file = {
        name: key,
        content: data.Body.toString('base64')
      }
      resolve(file)
    })
  })
}