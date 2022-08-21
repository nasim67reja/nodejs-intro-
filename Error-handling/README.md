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
