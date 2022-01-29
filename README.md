`.env` file:

```
GH_URL=https://api.github.com/graphql
GH_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

```
curl -H "authorization: bearer ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" https://api.github.com/rate_limit -I
...
x-oauth-scopes: read:org, repo, user
...
```
