const userDetails = require('./beanClasses/users');
const connection = require("../utilities/connections")

const usersDB = {}

usersDB.checkUser = (contactNo) => {
    return connection.getUserCollection().then((collection) => {
        return collection.findOne({ "contactNo": contactNo }).then((customerContact) => {
            if (customerContact) {
                return new userDetails(customerContact);
            }
            else return null;
        })
    })
}

usersDB.getPassword = (contactNo) => {
    return connection.getUserCollection().then((collection) => {
        return collection.find({ "contactNo": contactNo }, { _id: 0, password: 1 }).then((password) => {
            if (password.length !== 0)
                return password[0].password;
            else
                return null;
        })
    })
}

usersDB.generateId = () => {
    return connection.getUserCollection().then((collection) => {
        return collection.distinct("userId").then((ids) => {
            let num = ids.map(id=>{
                let digit = id.substr(id.length-4)
                return parseInt(digit)})
            let uId = Math.max(...num);
            return uId + 1;
        })
    })
}

usersDB.registerUser = (userObj) => {
    return connection.getUserCollection().then(collection => {
        return usersDB.generateId().then(newUserId => {
            userObj.userId = "U" + newUserId;
            return collection.create(userObj).then(data => {
                console.log(data);
                
                if(data.length !== 0){
                    return userObj;
                }else {
                    return null;
                }
            })
        })
    })
}

usersDB.addBookingId = (userId,bookingId) => {
    return connection.getUserCollection().then(collection => {
        return collection.updateOne( {userId: userId}, { $push: { bookings: bookingId } } ).then(data => {
            if(data.nModified !== 0) {
                return true;
            } else {
                return false;
            }
        })
    })
}

usersDB.removeBookingId = (userId,bookingId) => {
    console.log(userId,bookingId);
    
    return connection.getUserCollection().then(collection => {
        return collection.updateOne( {userId: userId}, { $pull: { bookings: bookingId } } ).then(data => {
            console.log(data);
            if(data.nModified !== 0) {
                return true;
            } else {
                return false;
            }
        })
    })
}





module.exports = usersDB;
