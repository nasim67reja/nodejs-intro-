# MongoDb and Mongoose

## How to connect your application to Mongodb

- At first install the mongoose `npm i mongoose`
- take the connection string from the mongodb
- then store that into a environment variable
  `DATABASE=mongodb+srv://admin:<PASSWORD>@cluster0.2y68t2u.mongodb.net/?retryWrites=true&w=majority`
- also store the password but separately
  `DATABASE_PASSWORD=dXdqBRCnWS3UAZn5`

- Then take this code into your application

```JavaScript
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => {
    console.log(err.message);
  });

```

## configure esLint

`npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev`

and create this file to your application `.eslintrc.json`

```JavaScript

{
  "extends": ["airbnb", "prettier", "plugin:node/recommended"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": ["error", { "endOfLine": "auto" }],
    "spaced-comment": "off",
    "no-console": "warn",
    "consistent-return": "off",
    "func-names": "off",
    "object-shorthand": "off",
    "no-process-exit": "off",
    "no-param-reassign": "off",
    "no-return-await": "off",
    "no-underscore-dangle": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": ["error", { "object": true, "array": false }],
    "no-unused-vars": ["error", { "argsIgnorePattern": "req|res|next|val" }]
  }
}

```

## CRUD OPERATION

### Creating

- `const newProduct = await Product.create(req.body);` => It will create new Product

### Reaading

- `const products = await Product.find();` => It will return all the product

### Updating

```JavaScript

const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
     new: true,
     runValidators: true,
   });

```

=> It will return all the product

### Deleting

- `await Product.findByIdAndDelete(req.params.id);` => This code is responsible for deleting a single product

for more check [this](https://mongoosejs.com/docs/queries.html)

## Import & Delete Data

- For Delete run this command in the console `node dev-data/data/import-dev-data.js --delete`
- For Importing file on database run this command in the console `node dev-data/data/import-dev-data.js --import`

## Virtual Properties

Virtual propertry is are basically fields that we can define on our schema but will not be persist in. they will not be saved in database in order to save some space in there.

```JavaScript

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

```

Now the data durationWeeks will found when we call all the tour.But the data will not exist in database that's why we can't run query for this data.
NOTE : we have add this to the schema type option

```JavaScript
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
```
