# Server side rendering with Pug

## Lec-176( Setting up Pug in Express)

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

  ## Lec-177 (First Steps with Pug)

  - Basic Structure of Pug

```pug
doctype html
html
 head
  title Natours
  link(rel="stylesheet", href="css/style.css")
  link(rel="shortcut icon", type='image/png' href="img/favicon.png")

body
 h1 The Park Camper
 p This is jsut some text
```

- (2) In order to pass data in the template all need to do is define an object here and then well some data and then
  the data will be available in the pug

```js
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Nasim'
  });
});
```

- for get data in the pug file we need to type `h1=tour`
- we can create comment in pug like these `//this is comment` but this will be available in the html file

- `//-this is comment` now this won't be availabe in html

- buffer code: `h1=tour` this type of code call buffer code
- we can write **javascript** like `h1=tour.toUpperCase()`

- Unbuffer code: that will not be render directly

```pug
 -const x=9
 h2=2*x
```

- third way : it's known as interpulation and like js **es6 template string** syntax
  `title Natour #{tour`}

  These are the fundamentals of pug

  ## Lec 180 (Extending Our base Template with Blocks)

- see the lecture for better understanding
  _Note that: 13m from lecture 183 check this video_
