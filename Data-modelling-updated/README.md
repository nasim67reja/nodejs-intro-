# Data Modelling with Mongodb

## Modelling Locations (Geospatial Data)

Mongodb supports geo spatial data out of the box and geo spatial data is the data that basically describes places on earth using latitude and longitude co-ordinates.
Mongodb uses a special data formates call geoJson in order to specify geospatial data.

- For realizing mongodb that it is a geospaital data not schema type option, we need to do specify two fields `type` and `co-ordinates`

```js

startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],

```

- That's actually it for now. we will use this for later in the sections for geo spatial query

## Modelling Tour Guides :Embeding

so the idea here is that when creating a new tour document the user will simple add an
array of user id's. and we will then get the corresponding users documents based ont his id's and add them to our tour document.
Now, How are gonna we do that?

- make a Schema option `Guides:Array`

- put this in the top of tourModel file `const User = require('./userModel');`

- then this middlewawre

```js
tourSchema.pre('save', async function(next) {
  const guidesPromises = this.guides.map(async id => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});
```

## Modelling Tour Guides : Child Referencing

- Special Schema type option

```js
guides: [
  {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
];
```

**note that we actually even don't need the Usermodel here for referencing**

- in the next lecture we will get the user data by a process call **Populating**

## Populating Tour Guides

- Explaination are exist in paper. check there

- Go to the single Product get handler function and add there populate.

```js
const tour = await Tour.findById(req.params.id).populate('guides');
```

- We also remove some fields

```js
const tour = await Tour.findById(req.params.id).populate({
  path: 'guides',
  select: '-__v -passwordChangedAt'
});
```

**Behind the scenes populate makes new query so don't use it in many places blindly ofcourse in large application**

- so now if we populate the tour guide in the getall the tour route then we have to copy this thing and paste in there
  But we can use middleware again here.

```js
// Populating tour guide
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    // select: '-__v -passwordChangedAt -passwordResetExpires -passwordResetToken'
    select: 'name email'
  });
  next();
});
```

- so now it will works with all the operation which will start with find like update,patch and delete

### let's recape

it's a two step process

- first we create a reference to another model with these we effectively create relationship between two dataset
- then in the second step we populate that field that we just specified before the 'guides' using the populate methods
