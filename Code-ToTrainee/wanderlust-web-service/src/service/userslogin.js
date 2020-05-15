const userDB = require('../model/userslogin');

const userService = {}

//login a user
userService.login = (contactNo, userPassword) => {
    return userDB.checkUser(contactNo).then((user) => {
        if (user === null) {
            let err = new Error("Enter the registered contact number!")
            err.status = 404
            throw err;
        }
        else {
            return userDB.getPassword(contactNo).then((password) => {
                if (password !== userPassword) {
                    let err = new Error("Enter correct password")
                    err.status = 406
                    throw err;
                }
                else {
                    return user;
                }
            })
        }
    })
}

userService.register = (userObj) => {
    return userDB.checkUser(userObj.contactNo).then((user) => {
        if (user !== null) {
            let err = new Error("Already registered")
            err.status = 404
            throw err
        }
        else {
            return userDB.registerUser(userObj).then((obj) => {
                if (obj === null) {
                    let err = new Error("Registration failed! Please try again")
                    err.status = 406
                    throw err
                }
                else {
                    return obj;
                }
            })
        }
    })
}


module.exports = userService
