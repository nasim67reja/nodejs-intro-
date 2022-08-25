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

## lec-154 (Modelling Reviews:Parent Referencing)

```js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
```

## Creating and Getting Reviews

- Implement all the `reviewRoutes`, `reviewController` create a review in postman like this

```js
{
    "review":"Great Product ",
    "rating":4.5,
    "product":"62fc9f67fbb202a6698846a5",
    "user":"6302f4dd9cd0e816d2dc8673"
}
```

## Lec-156 (Poplating Reviews)

- took this into reviewModel file

```js
//  QUERY MIDDLEWATE
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name'
  }).populate({
    path: 'product',
    select: 'name summary'
  });

  // this.populate({
  //   path: 'user',
  //   select: 'name '
  // });
  next();
});
```

## Lec-157 (Virtual Populate:Tours and Reviews)

- explaination had in paper

```js
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});
```

- so the schema will done but virtually not like before and now the only work is remain to do
- and this is `populate` . but now we don't use middleware for all the query start with find. beacuse user don't need to all the reivew
  in all the tour.
- so just use this populate in single tour in this case `getTour` controller.

`const tour = await Tour.findById(req.params.id).populate('reviews');`

- for closing the chain off the populate for tour in review.
  i mean

```js
reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name'
  // }).populate({
  //   path: 'tour',
  //   select: 'name summary'
  // });

  this.populate({
    path: 'user',
    select: 'name '
  });
  next();
});
```

## Nested routes

- explaination have in paper

- put this code into `createReview` handler

```js
// Allow nested routes

if (!req.body.tour) req.body.tour = req.params.tourId;
if (!req.body.user) req.body.user = req.user.id;
```

**we will get req.user from protect middleware**

- Basically we was trying to write tourid and userid manually when create a review.but this is not true in real world
  application. basically the tour id comes from route and the user id comes from the currently logged in user.
  that's why we need to specify the tour id into the route like these `//post /tour/:tourId/reviews`

## Nested Routes with express

- the problem here is that we use reviewController in tourRoutes file and write same code in two places.
  for overcome this problem express gives us a solution like these
  In tour routes

```js
const reviewRouter = require('./../routes/reviewRoutes');
//then
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router.use('/:tourId/reviews', reviewRouter);
```

- Then write `const router = express.Router({ mergeParams: true });` . this will solve our problem

## Adding a nested get endpoint

- Add this to the `getAllReviews` handler funciton

```js
let filter = {};
if (req.params.tourId) filter = { tour: req.params.tourId };

const reviews = await Review.find(filter);
```

## Indexes

- It's basically decrease the query for mongodb and improve the performance. for better explaination check the paper

```js
// Indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
```

**Don't ignore index. because it's really benefitial for large application**

## Calculating Average rating on Tours

- import `const Tour = require('./tourModel');` file on reviewModel

- then write these. for understanding check the video

```js
// static method for rating
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
```

## Lec-170 (Preventing Duplicate review)

`reviewSchema.index({ tour: 1, user: 1 }, { unique: true });` put this code in the `reviewSchema` file

**Jonas index is not work becasue** -I had a look into why the unique indexing is not working for the Reviews, the reason is that you probably
already have duplicate Reviews in your database and so mongoDB fails to add the unique option to the index. What you need to do is to delete the
recent made reviews and then run the code.

- `set: val => Math.round(val * 10) / 10` it will round the value of ratingAverage
