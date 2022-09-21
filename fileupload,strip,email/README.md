# Section 13 : Advanced Features: Payments,Email,File Uploads

## lec:199 Image Uploads Using Multer:

Explaination had in paper

- at first install the package `npm i multer`

- In the userRoutes.js file put this line `const multer=require('multer')`

- now we need to configure a so called multer upload
  `const upload = multer({ dest: 'public/img/users' });` // this is the destination where we want to save the image
  we could just acctually have called multer funtion without any option
  but in this case the image will be simple stored in memory not save anywhere in the disk

- and the very important thing is that image directly not save or upload in the database
  we just upload them into our file system and then in the database we put the link basically to that image

- and now use this upload here to really create a middleware function
  that we can put here into the updateme route

```js
router.patch(
  '/updateMe',
  authController.protect,
  upload.single('photo'),
  user
```

- of Course `upload.single()` middleware put the file or at least some information
  about the file on the request object

  - for cheking the information go to the `updateMe` handler and write `console.log(req.file)`//request req.body do not give the file information
    and that is also why we need `multer` package
    now test this on postman

    - and the go to `form-data` tab for uploading the file

- The upload actually working but we could not see the file beacuse the pathname did nto actually hold
  any format like jpg and png and the filename also did not specified by us

SO we need to configure the multer

## lec:200 (Configure the Multer)

First giving a better filename and second allowing only images files to be uploaded on to our server
and to start let's actuallly move all the multer related stuff from this router to the controller

put this stuffs from userRoutes to userController

```js
const multer = require('multer');

const upload = multer({ dest: 'public/img/users' });

exports.uploadUserPhoto = upload.single('photo');
```

and then create a router for this uploadUserPhoto handler

```js
router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.updateMe
);
```

- and now actually go ahead in configure or multer upload

```js
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Please upload ony images.', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
```

- so all of our multer configrution now works really fine but of course there are one step
  missing and that is actually link the user to the newly updated image because right now in the database
  we obviously still have the path or actually the name of the old image because no one in our code we specified that
  we want to update the user document itself

So let's fixed that in the next video

## Lec : 201 (Saving image name to database)

`if (req.file) filteredBody.photo = req.file.filename;` put this line
in updateMe controller
it will help to update user photo

- and write this in the userModel

```js
 photo: {
    type: String,
    default: 'default.jpg'
  },
```

## Lec:202 (Resizing Images)

- For resizing the image, we are going to use the sharp package `npm i sharp`

In userController

`const sharp = require('sharp');`

```js
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
// if we need image processing then we need to go like this

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Please upload ony images.', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});
```

Then in the userRoute file

```js
router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
```

## Lec : 203

it's about pug

## Lec : 204 (Multiple Images)

```js
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});
```

In the tourRoutes file :

```js
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
```

## Lec : 206 (Building a Complex Email Handler)

```js
const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmToText, htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Nasim Reja <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }
};
```

Then create the base template with pug

and then took this into authController > signup

```js
const url = `${req.protocol}://${req.get('host')}/me`;
await new Email(newUser, url).sendWelcome();
```
