const connection = require("../utilities/connections")

const bookingsDB = {}

bookingsDB.generateId = () => {
    return connection.getbookingsCollection().then((collection) => {
        return collection.distinct("bookingId").then((ids) => {
            let num = ids.map(id=>{
                let digit = id.substr(id.length-4)
                return parseInt(digit)})
            let uId = Math.max(...num);
            return uId + 1;
        })
    })
}

bookingsDB.book = (bookingData) => {
    return connection.getbookingsCollection().then((collection) => {
        return bookingsDB.generateId().then(newbId => {
            bookingData.bookingId = "B" + newbId;
            return collection.create(bookingData).then(insertedData => {
                if (insertedData) {
                    return bookingData.bookingId;
                }
                else return null;
            })
        })
    })
} 

bookingsDB.checkUserBookings = (userId) => {
    return connection.getbookingsCollection().then(collection => {
        return collection.find({ "userId": userId}).then(userBookings => {
            // console.log(userBookings);
            if(userBookings.length !== 0){
                return userBookings;
            } else return null;
        })
    })
}

bookingsDB.deleteBooking = (bookingId) => {
    return connection.getbookingsCollection().then(collection => {
        console.log(bookingId);
        
        return collection.deleteOne({ bookingId: bookingId }).then(data => {
            console.log("delete-",data);
            
            if(data.deletedCount !== 0) {
                return true;
            } else {
                return false;
            }
        })
    })
}


module.exports = bookingsDB;