# EXPRESS BASICS

## How to serve statics file from server

If we actually want to access something from our file system we need use a build in express middleware. put this middleware into your `app.js` file
`app.use(express.static(`${\_\_dirname}/public`));`
