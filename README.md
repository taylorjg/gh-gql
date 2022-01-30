`.env` file:

```
GH_URL=https://api.github.com/graphql
GH_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

You can check the scopes associated with a token by making a request (e.g. to `/rate_limit` which doesn't count against your rate limit)
and then examining the `x-oauth-scopes` response header:

```
curl -H "authorization: bearer ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" https://api.github.com/rate_limit -I
...
x-oauth-scopes: repo, user
...
```
