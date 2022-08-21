# Error Handling

## Handling Unhandled Routes

```JavaScript

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.oroginalUrl} on this server!`
  });
});

```

Put this below all the route.

## Implement Global middleware Handler

Here, basically the goal is catching all the error from different middleware. for better understanding see the explaination in paper or video lecture

```JavaScript
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

```

## Now Create an Error

```JavaScript

app.all('*', (req, res, next) => {
  //  res.status(404).json({
  //   status:'fail',
  //   message:`Can't find ${req.originalUrl} on this server!`
  //  })

  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err) // note this
});

```

for `next(err)` all the middleware will ignore and global Error middleware will be run

- So, now we can implement same logic in all the middleware.

```JavaScript
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err) // note this

```

Put this code and add this to all the middleware.

- But Instead of `new Error()` we will create our own error class
- All this doing in `app.js` file

## Creating our own Error class

- `console.log(stack)` => It will basically gives the information about error like where the error is happened

```JavaScript

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

```

- Now import this into `app.js` file like this `const AppError = require('./utils/appError');`
- Then use this build in error class into `app.all` middleware

```JavaScript

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

```

## Exports the errorhandler

-and now we finally also want to export the global error handler middleware.
Because the throughout the rest of the section we are gonna build a couple of different functions for handling with different types of errors.
So, we want all of this functions to be all in the same files.
we can also call the handler to controller. so we can put this into a file called `errorController`.

`errorController.js`

```JavaScript
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};
```

`app.js` => `const globalErrorHandler = require('./controllers/errorController'`
`app.use(globalErrorHandler)`

## Catching Errors in Async Function

- until now, we have a messy code in our controller file. we have async function and try & catch block which made our code messy
  now we will create a `catchAsync` file in utils folder

```Js
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
```

- Now exports this in `tourController` file and use this for all the controller.

`const catchAsync = require('./../utils/catchAsync');`
`const AppError = require('./../utils/appError');`

- one controller. for see all the controller please check the code

```js
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});
```

**Now there is a problem is the all errors comes with 500**

- Becasue we define 500 in appError class. now we change this error code based on condition

```js
if (!tour) {
  return next(new AppError('No tour found with that ID', 404));
}
```

- put this code into getTour,UpdateTour and deleteTour handler
