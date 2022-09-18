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
