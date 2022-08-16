# EXPRESS BASICS

## How to serve statics file from server

If we actually want to access something from our file system we need use a build in express middleware. put this middleware into your `app.js` file
`app.use(express.static(`${\_\_dirname}/public`));`

- when we created a document for the collection we will use the string for storing the images on database.But the actual image will be serve from server not from the database.

- The string which ones will store in the databse look like `"http://127.0.0.1:8000/phone.jpg"`. look here no public name is use

- Then, when we call the api from frontend then the image will be availabe in there
