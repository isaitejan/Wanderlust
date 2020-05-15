const bookingsDB = require('../model/bookings');
const packageDB = require('../model/packageDestinations');
const usersDB = require('../model/userslogin');

const bookingsService = {}

bookingsService.book = (bookingData) => {
    return packageDB.checkAvailability(bookingData.destId).then(availability => {
        if(availability.availability < bookingData.noOfPersons) {
            let err = new Error("Package not available currently!!")
            err.status = 404;
            throw err;
        } else {
            return bookingsDB.checkUserBookings(bookingData.userId).then(userBookings => {
                if(userBookings === null) {
                    return packageDB.updateAvailability(bookingData.destId, bookingData.noOfPersons).then(availability => {
                        if(!availability){
                            let err = new Error("Booking Failed!! Please try again!!")
                            err.status = 406;
                            throw err;
                        } else {
                            return bookingsDB.book(bookingData).then(bookingId => {
                                if(bookingId !== null) {
                                    console.log(bookingData.userId,bookingId);
                                    return usersDB.addBookingId(bookingData.userId,bookingId).then(data => {
                                        if(data) {
                                            return bookingId;
                                        }
                                    })
                                } else {
                                    let err = new Error("Booking Failed!! Please try again!!")
                                    err.status = 406;
                                    throw err;
                                }
                            })
                        }
                    })
                } else {
                    let dateCollide =  userBookings.filter(booking => {
                        if(booking.checkInDate < bookingData.checkInDate && booking.checkOutDate > bookingData.checkInDate) { 
                            console.log(booking.checkInDate , bookingData.checkInDate,booking.checkInDate < bookingData.checkInDate , booking.checkOutDate , bookingData.checkInDate,booking.checkOutDate > bookingData.checkInDate);
                            return true;}
                        else if(booking.checkInDate < bookingData.checkOutDate && booking.checkOutDate > bookingData.checkInDate  ) { 
                            console.log(booking.checkInDate , bookingData.checkOutDate ,booking.checkInDate < bookingData.checkOutDate ,  booking.checkOutDate , bookingData.checkInDate,booking.checkOutDate > bookingData.checkInDate);   
                            return true;}
                    })
                    if(dateCollide.length !== 0) {
                        let err = new Error("You have a another package booked in selected trip span!!")
                        err.status = 406;
                        throw err;
                    } else {
                        return packageDB.updateAvailability(bookingData.destId, bookingData.noOfPersons).then(availability => {
                            if(!availability){
                                let err = new Error("Booking Failed!! Please try again!!")
                                err.status = 406;
                                throw err;
                            } else {
                                return bookingsDB.book(bookingData).then(bookingId => {
                                    if(bookingId !== null) {
                                        console.log(bookingId);
                                        return usersDB.addBookingId(bookingData.userId,bookingId).then(data => {
                                            if(data) {
                                                return bookingId;
                                            }
                                        })
                                    } else {
                                        let err = new Error("Booking Failed!! Please try again!!")
                                        err.status = 406;
                                        throw err;
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    })
}

bookingsService.getBookings = (userId) => {
    return bookingsDB.checkUserBookings(userId).then(bookingsDetails => {
        if(bookingsDetails === null) {
            let err = new Error("You have no Planned Trips")
            err.status = 404;
            throw err;
        } else {
            return bookingsDetails;
        }
    })
}

bookingsService.deleteBooking = (booking) => {
    return bookingsDB.deleteBooking(booking.bookingId).then(status => {
        if(!status) {
            let err = new Error("Delete-Sorry couldn't cancel..!! Please try again!!")
            err.status = 406;
            throw err;
        } else {
            console.log("service",booking.userId,booking.bookingId);
            
            return usersDB.removeBookingId(booking.userId, booking.bookingId).then(status => {
                if(!status) {
                    let err = new Error("remove-Sorry couldn't cancel..!! Please try again!!")
                    err.status = 406;
                    throw err;
                } else {
                    return packageDB.increaseAvailability(booking.destId, booking.noOfPersons).then(status => {
                        if(!status) {
                            let err = new Error("increase-Sorry couldn't cancel..!! Please try again!!")
                            err.status = 406;
                            throw err;
                        } else { 
                            return "Booking Cancelled";
                        }
                    })
                }
            }) 
        }
    })
}

module.exports = bookingsService



// return bookingsDB.book(bookingData).then((insertedData) => {
//     if (insertedData == null) {
//         let err = new Error("Booking Failed!! Please try again!!")
//         err.status = 404
//         throw err;
//     }
//     else {
//         return insertedData;
//     }
// })




// if(userBookings.checkInDate < bookingData.checkOutDate || userBookings.checkOutDate > bookingData.checkInDate) {
//     let err = new Error("You have a another package booked in selected trip span")
//     err.status = 404
//     throw err;
// } 

// if(new Date(booking.checkInDate).getTime() < new Date(bookingData.checkOutDate).getTime() || new Date(booking.checkOutDate).getTime() > new Date(bookingData.checkInDate).getTime() ) {
//     console.log(new Date(booking.checkInDate).getTime() ,new Date(bookingData.checkOutDate).getTime(),
//     new Date(booking.checkInDate).getTime() < new Date(bookingData.checkOutDate).getTime() , 
//     new Date(booking.checkOutDate).getTime() , new Date(bookingData.checkInDate).getTime(),
//     new Date(booking.checkOutDate).getTime() > new Date(bookingData.checkInDate).getTime());
//     return true;
// }