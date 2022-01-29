require("dotenv").config()
const { GraphQLClient, gql } = require("graphql-request")

const { GH_URL, GH_TOKEN } = process.env

const query = gql`
  query GetUser($login: String!) {
    user(login: $login) {
      login
      name
      email
      location
      company
      url
    }
  }
`

const main = async () => {
  try {
    const options = {
      headers: {
        authorization: `bearer ${GH_TOKEN}`
      }
    }
    const client = new GraphQLClient(GH_URL, options)
    const variables = {
      login: "taylorjg"
    }
    const data = await client.request(query, variables)
    console.dir(data)
  } catch (error) {
    console.log("[main]", "ERROR:", error.message)
  }
}

main()
