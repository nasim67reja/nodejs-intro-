# Server side rendering with Pug

The process, by which we are gonna tell express what template we will use are given below:

- Install the pug `npm i pug`
- write this code in the beginning of your app `app.set('view engine','pug');`

so we define our views engine, now we also need to define where this views are actually located in our file system
pug templates are called views in express

- So now create a `views` folder

- so in order to now define which folder our views are actually located only we need to do again
  we will use path module for writing directory
  `const path=require('path')` and then put this file below view engine `app.set('views', path.join(__dirname, 'views'));`

- now crete a file in views folder called `base.pug`
  `h1 Hello world` and type this. this is simiilar to html

  - now create a route for accesing this file

  ```js
  app.get('/', (req, res) => {
    res.status(200).render('base');
  });
  ```

  - and that's actually it
