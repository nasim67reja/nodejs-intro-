const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
// const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
// const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // console.log(tour);

  // 2) Create checkout session

  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ['card'],
  //   mode: 'payment',
  //   success_url: `${req.protocol}://${req.get('host')}/`,
  //   cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
  //   customer_email: req.user.email,
  //   client_reference_id: req.params.tourId,
  //   line_items: [
  //     {
  //       price_data: {
  //         currency: 'usd',
  //         price_data: {
  //           currency: 'inr',
  //           unit_amount: tour.price * 100,
  //           product_data: {
  //             name: `${tour.name} Tour`,
  //             description: tour.summary,

  //           }
  //         },
  //         quantity: 1
  //       }
  //     }
  //   ]
  // });
  const session = await stripe.checkout.sessions.create({
    expand: ['line_items'],
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
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

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

//  images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`];
