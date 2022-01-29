require("dotenv").config()

const { GraphQLClient, gql } = require("graphql-request")

const { GH_URL, GH_TOKEN } = process.env

const query = gql`
  query GetUser($login: String!, $reposAfter: String) {
    user(login: $login) {
      login
      name
      email
      location
      company
      url
      avatarUrl
      websiteUrl
      repositories(first: 100, after: $reposAfter) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            name
            isFork
            owner {
              login
            }
            languages(first: 100) {
              edges {
                size
              }
              nodes {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`

// http://graphql.org/learn/pagination/
// https://stackoverflow.com/questions/48116781/github-api-v4-how-can-i-traverse-with-pagination-graphql

const main = async () => {
  try {
    const options = {
      headers: {
        authorization: `bearer ${GH_TOKEN}`
      }
    }
    const client = new GraphQLClient(GH_URL, options)
    const variables = {
      login: process.argv.length === 3 ? process.argv[2] : "taylorjg"
    }
    for (; ;) {
      const data = await client.request(query, variables)
      const moreReposToFetch = data.user.repositories.pageInfo.hasNextPage
      const reposAfter = data.user.repositories.pageInfo.endCursor
      const repoCount = data.user.repositories.edges.length
      console.log({ moreReposToFetch, reposAfter, repoCount })
      if (moreReposToFetch) {
        variables.reposAfter = reposAfter
      } else {
        break
      }
      // console.dir(data, { depth: null })
    }
  } catch (error) {
    console.log("[main]", "ERROR:", error.message)
  }
}

main()
