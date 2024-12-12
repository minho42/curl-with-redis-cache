# curl-with-redis-cache

node.js script to use local redis to cache curl results

## usage

```shell
# install dependencies
> npm i

# run the script
> node index.js
```

## alias

```shell
# ~/.zshrc
alias curl0="node /Users/.../curl-with-redis-cache/index.js"

# use alias
> curl0 https://jsonplaceholder.typicode.com/posts/1
```
