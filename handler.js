import "@babel/polyfill"
import { graphql, buildSchema} from 'graphql'
import { getObject } from './S3' 

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  input FileInput {
    name: String
    type: String
    
  }

  type FileMetadata {
    id: ID!
    fileId: ID!
    fileType: FileExtension
  }

  type File {
    id: ID!
    content: String
    author: String
  }

  enum FileExtension {
    PDF
  }

  type Query {
    file(id: ID!): File
  }

`)

// The root provides a resolver function for each API endpoint
const root = {
  file: async ( { id } ) => {
    let file = await getObject('', 'test.txt')
    return file
  }
}

// We want to make a GET request with ?query=<graphql query>
// The event properties are specific to AWS. Other providers will differ.
exports.query = async (event, context) => {
  try {
      // Message passed into Lambda
      console.log(event.queryStringParameters.query)
      var query = `{ ${event.queryStringParameters.query} }`

      // Run the GraphQL query (E.g. '{ person { name } }' prints out the response '{name: "Andrew"}')
      await graphql(schema, query, root).then((response) => {
        console.log(response)
        return response
      })
      return 
  } catch (error) {
      console.log(error.stack)
  }
}