const express = require('express');
const router = express.Router();
const setupBookings = require("../model/setupBookings");
const bookingsService = require('../service/bookings');
// const users = require('../model/beanClasses/users');

router.get("/setup", (req, res, next) => {
    setupBookings.bookingsSetup().then((data) => {
        res.send(data)
    }).catch(err => next(err));
})


router.post('/:userId/:destId', (req, res, next) => {
    let destId = req.params.destId;
    let userId = req.params.userId;
    bookingData = req.body;
    bookingData.destId = destId;
    bookingData.userId = userId;
    bookingsService.book(bookingData)
    .then(userDetails =>{
        res.json(userDetails);
    }).catch(err =>{
        console.log(err);
        next(err)});
})

router.get('/getDetails/:userId', (req, res, next) => {
    let userId = req.params.userId;
    bookingsService.getBookings(userId)
    .then(bookingsDetails => {
        res.json(bookingsDetails);
    }).catch(err => {
        console.log(err);
        next(err);
    })
})

router.delete('/cancelBooking/:bookingId', (req, res, next) => {
    // let bookingId = req.params.bookingId;
    booking = req.body;
    console.log(booking);
    
    bookingsService.deleteBooking(booking)
    .then(status => {
        res.json(status);
    }).catch(err => {
        console.log(err);
        next(err);
    })
})

module.exports = router;
