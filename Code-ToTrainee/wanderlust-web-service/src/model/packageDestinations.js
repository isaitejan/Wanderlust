const connection = require("../utilities/connections")

const packageDB = {}

packageDB.getHotDeals = () => {
    return connection.gethdCollection().then((collection) => {
        return collection.find().then((deals) => {
            if (deals) {
                return deals;
            }
            else return null;
        })
    })
}

packageDB.destination = (continent) => {
    let allDestinations = []
    return connection.getDestinationsCollection().then((collection) => {
        return collection.find({ "continent": continent }).then((destinationObj) => {
            if (destinationObj.length !== 0) {
                // console.log(destinationObj)
                allDestinations = destinationObj.map(dest => {return dest})
                return connection.gethdCollection().then(hdcollection => {
                    return hdcollection.find({ continent: continent}).then(hds => {
                        if(hds.length !== 0) {
                            hds.forEach(dest => { allDestinations.push(dest) })
                            return allDestinations;
                        } else {
                            return allDestinations;
                        }
                    })
                })
            }
            else { return null;}
        })
    })
}

packageDB.checkAvailability = (destId) => {
    if(destId[0] === 'D'){
        return connection.getDestinationsCollection().then(collection => {
            return collection.findOne({ destinationId: destId},{ availability:1, _id:0}).then(availability => {
                if(availability){console.log("check", availability);
                return availability;}
                else return null;
            })
        })  
    } else {
        return connection.gethdCollection().then(collection => {
            return collection.findOne({ destinationId: destId},{ availability:1, _id:0}).then(availability => {
                if(availability){console.log("check", availability);
                return availability;}
                else return null;
            })
        }) 
    }
}

packageDB.updateAvailability = (destId, noOfPersons) => {
    if(destId[0] === 'D') {
        return connection.getDestinationsCollection().then(collection => {
            return collection.updateOne({ destinationId: destId},{ $inc: { availability: -noOfPersons } }).then(availability => {
                if(availability.nModified !== 0){ console.log(availability);
                return true; }
                else return false;
            })
        })
    } else {
        return connection.gethdCollection().then(collection => {
            return collection.updateOne({ destinationId: destId},{ $inc: { availability: -noOfPersons } }).then(availability => {
                if(availability.nModified !== 0){ console.log(availability);
                return true; }
                else return false;
            })
        })
    }
}

packageDB.increaseAvailability = (destId, noOfPersons) => {
    if(destId[0] === 'D') {
        return connection.getDestinationsCollection().then(collection => {
            return collection.updateOne({ destinationId: destId},{ $inc: { availability: noOfPersons } }).then(availability => {
                if(availability.nModified !== 0){ console.log(availability);
                return true; }
                else return false;
            })
        })
    } else {
        return connection.gethdCollection().then(collection => {
            return collection.updateOne({ destinationId: destId},{ $inc: { availability: noOfPersons } }).then(availability => {
                if(availability.nModified !== 0){ console.log(availability);
                return true; }
                else return false;
            })
        })
    }
}




module.exports = packageDB;
