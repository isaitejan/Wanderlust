const packageDB = require('../model/packageDestinations');

const packageService = {}

packageService.hotdeals = () => {
    return packageDB.getHotDeals().then((hds) => {
        if (hds == null) {
            let err = new Error("Sorry no Hot Deals available currently!!")
            err.status = 404
            throw err;
        }
        else {
            return hds;
        }
    })
}


packageService.destination = (continent) => {
    return packageDB.destination(continent).then(destinationObj =>{
        if(destinationObj === null) {
            let err = new Error("Sorry we don't operate in this Destination")
            err.status = 406
            throw err;
        }
        else {
            return destinationObj;
        }
    })
}

module.exports = packageService
