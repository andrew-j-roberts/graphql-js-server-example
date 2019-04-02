import "@babel/polyfill"
import { graphql, buildSchema} from 'graphql'
import { getObject } from './S3' 

// retrieve s3 bucket name from custom property of serverless.yml config file
const S3_BUCKET = process.env.S3_BUCKET

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  input FileInput {
    name: String!
    content: String
    type: String
  }

  type FileMetadata {
    id: ID!
    fileName: String!
    fileType: String!
    fileBucket: String!
    fileKey: String!
  }

  type File {
    name: String!
    content: String
  }

  type Query {
    file(name: String!): File
  }

`)

// The root provides a resolver function for each API endpoint
const root = {
  file: async ( { name } ) => {
    let file = await getObject(S3_BUCKET, name)
    return file
  }
}

// Handle a GET request with ?query=<graphql query>
exports.query = async (event, context) => {
  try {
      // form query
      var query = decodeURI(event['body'])
      // prep response object
      let response = {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
      // Run the GraphQL query
      // E.g. '{ file(name: "example.txt") { name, content } }' might produce the response '{ data: { file: { name: "example.txt", content: "<base64>" } } }'
      let file = await graphql(schema, query, root).catch(err => {throw new Error(err)})
      // update response object
      response['body'] = JSON.stringify(file)
      return response
  } 
  catch (error) {
    console.log(error.stack)
  }
}