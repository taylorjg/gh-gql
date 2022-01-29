require("dotenv").config()

const { GraphQLClient, gql } = require("graphql-request")

const { GH_URL, GH_TOKEN } = process.env

const query1 = gql`
  query Query1($login: String!, $reposAfter: String) {
    user(login: $login) {
      login
      name
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
            description
            isFork
            owner {
              login
            }
            languages(first: 100, orderBy: { direction: DESC, field: SIZE }) {
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

const query2 = gql`
  query Query2($login: String!, $query: String!, $searchAfter: String) {

    rateLimit {
      limit
      cost
      remaining
      resetAt
    }

    user(login: $login) {
      login
      name
      location
      company
      url
      avatarUrl
      websiteUrl
    }

    search(first: 100, type: REPOSITORY, query: $query, after: $searchAfter) {
      codeCount
      issueCount
      repositoryCount
      userCount
      nodes {
        ... on Repository {
          name
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

const runQuery1 = async (client, login) => {
  const variables = {
    login
  }
  for (; ;) {
    const data = await client.request(query1, variables)
    const moreReposToFetch = data.user.repositories.pageInfo.hasNextPage
    const reposAfter = data.user.repositories.pageInfo.endCursor
    const repoCount = data.user.repositories.edges.length
    console.log({ moreReposToFetch, reposAfter, repoCount })
    console.dir(data.user.repositories.edges[0], { depth: null })
    if (moreReposToFetch) {
      variables.reposAfter = reposAfter
    } else {
      break
    }
  }
}

const runQuery2 = async (client, login) => {
  const variables = {
    login,
    query: `user:${login} fork:false`
  }
  for (; ;) {
    const data = await client.request(query2, variables)
    console.dir(data.rateLimit)
    if (!variables.searchAfter) {
      console.dir(data.user)
    }
    const moreReposToFetch = data.search.pageInfo.hasNextPage
    const searchAfter = data.search.pageInfo.endCursor
    const nodeCount = data.search.nodes.length
    console.log({
      codeCount: data.search.codeCount,
      issueCount: data.search.issueCount,
      repositoryCount: data.search.repositoryCount,
      userCount: data.search.userCount
    })
    console.log({ moreReposToFetch, searchAfter, nodeCount })
    console.dir(data.search.nodes[0], { depth: null })
    if (moreReposToFetch) {
      variables.searchAfter = searchAfter
    } else {
      break
    }
  }
}

const main = async () => {
  try {
    const login = process.argv.length === 3 ? process.argv[2] : "taylorjg"
    const options = {
      headers: {
        authorization: `bearer ${GH_TOKEN}`
      }
    }
    const client = new GraphQLClient(GH_URL, options)
    await runQuery1(client, login)
    await runQuery2(client, login)
  } catch (error) {
    console.log("[main]", "ERROR:", error.message)
  }
}

main()
