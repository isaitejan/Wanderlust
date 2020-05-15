const express = require('express');
const router = express.Router();
const setupUser = require("../model/setupUser");
const userservice = require('../service/userslogin');
const users = require('../model/beanClasses/users');

router.get("/setup", (req, res, next) => {
    setupUser.userSetup().then((data) => {
        res.send(data)
    }).catch(err => next(err));
})

//router to login
router.post('/login', function (req, res, next) {
    let contactNo = req.body.contactNo;
    let password = req.body.password;
    userservice.login(parseInt(contactNo), password)
    .then(userDetails =>{
        res.json(userDetails);
    }).catch(err =>{
        console.log(err);
        next(err)});
})

//router to register
router.post('/register', (req, res, next) => {
    let userObj = new users(req.body)
    console.log(userObj);
    
    userservice.register(userObj).then(objDetails =>{
        res.json(objDetails);
    }).catch(err =>{
        next(err)
    });
})

module.exports = router;

