const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
<<<<<<< HEAD
// const User = require('../models/userModel');
=======
>>>>>>> d6b670e69b716c374b0bbf126340a96c952af7c7
// const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
// const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
<<<<<<< HEAD
  // console.log(tour);

  // 2) Create checkout session
  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],
  //     // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
  //     //   req.params.tourId
  //     // }&user=${req.user.id}&price=${tour.price}`,
  //     success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
  //     cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
  //     customer_email: req.user.email,
  //     client_reference_id: req.params.tourId,
  //     line_items: [
  //       {
  //         name: `${tour.name} Tour`,
  //         description: tour.summary,
  //         images: [
  //           `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`
  //         ],
  //         amount: tour.price * 100,
  //         currency: 'usd',
  //         quantity: 1
  //       }
  //     ]
  //   });
  const session = await stripe.checkout.sessions.create({
    expand: ['line_items'],
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
=======

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
>>>>>>> d6b670e69b716c374b0bbf126340a96c952af7c7
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
<<<<<<< HEAD
        price_data: {
          currency: 'usd',
=======
        quantity: 1,
        price_data: {
          currency: 'inr',
>>>>>>> d6b670e69b716c374b0bbf126340a96c952af7c7
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
<<<<<<< HEAD
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`
            ]
          }
        },
        quantity: 1
      }
    ],
    mode: 'payment'
  });

=======
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
          }
        }
      }
    ]
  });

  // 2) Create checkout session
  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],
  //     success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
  //       req.params.tourId
  //     }&user=${req.user.id}&price=${tour.price}`,
  //     cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
  //     customer_email: req.user.email,
  //     client_reference_id: req.params.tourId,

  // line_items: [
  //   {
  //     name: `${tour.name} Tour`,
  //     description: tour.summary,
  //     images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
  //     price: tour.price * 100,
  //     currency: 'usd',
  //     quantity: 1
  //   }
  // ]
  //   });

>>>>>>> d6b670e69b716c374b0bbf126340a96c952af7c7
  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});
<<<<<<< HEAD
=======

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();
//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

// exports.createBooking = factory.createOne(Booking);
// exports.getBooking = factory.getOne(Booking);
// exports.getAllBookings = factory.getAll(Booking);
// exports.updateBooking = factory.updateOne(Booking);
// exports.deleteBooking = factory.deleteOne(Booking);
>>>>>>> d6b670e69b716c374b0bbf126340a96c952af7c7
