const express = require('express');
const router = express.Router();
const setup = require("../model/setupPackages");
const packageservice = require('../service/packageDestinations');
// const users = require('../model/beanClasses/users')

router.get("/setup", (req, res, next) => {
    setup.destinationsSetup().then((data) => {
        if(data === "Insertion Successfull"){
            setup.hdSetup().then(data =>{
                res.send(data)
            }).catch(err => next(err))
        }
    }).catch(err => next(err));
})

//router to login
router.get('/hotdeals', (req, res, next) => {
    packageservice.hotdeals().then(hds =>{
        res.json(hds);
    }).catch(err =>{
        console.log(err);
        next(err)});
})

//router to register
router.get('/destinations/:continent', (req, res, next) => {
    let continent = req.params.continent
    // console.log(continent);
    
    packageservice.destination(continent).then(destinationObj =>{
        res.json(destinationObj);
    }).catch(err =>{
        next(err)
    });
})

module.exports = router;

