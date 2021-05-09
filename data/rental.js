//Yixuan Wang 

const mongoCollections = require("../config/mongoCollections");
const uuid = require("uuid");
const verifier = require("./verify");
const rental = mongoCollections.rental
const shareUtilsDB = require("./shareUtilsDB");


const ExportedMethods = {

    //create

    async createRental(location, price, bedroom, bathroom, space, description, photos, utility, like, dislike, labels, contact, newId) {
        // use function on verify.js
        if (!verifier.validString(location)) throw "Location is not a valid string.";
        if (!verifier.validNum(price)) throw "Price is not a valid number.";
        if (!verifier.validNum(bedroom)) throw "Bedtoom is not a valid number.";
        if (!verifier.validNum(bathroom)) throw "Bathroom is not a valid number.";
        if (!verifier.validNum(space)) throw "Space is not a valid number.";
        if (!verifier.validString(description)) throw "Description is not a valid string.";
        // if (!verifier.validString(photo)) throw "photo is not a valid string.";
        if (!verifier.validString(utility)) throw "utlity is not a valid string.";
        if (!verifier.validBoolean(sold)) throw "Sold should be a boolean";
        // if (!verifier.validString(contact)) throw "contact should be a string";


        const rentalCollection = await rental()

        const newRental = {
            location: location, 
            price: price, 
            bedroom: bedroom, 
            bathroom: bathroom, 
            space: space, 
            description: description , 
            photos: photos, 
            utility: utility, 
            like: like, 
            dislike: dislike, 
            labels: labels, 
            contact: contact,
            _id: uuid.v4()
        }
        const insertInfo = await rentalCollection.insertOne(newRental)
        if (insertInfo.insertedCount === 0) throw 'Could not add a rental post';
        const newId = insertInfo.insertedId
        await shareUtilsDB.toggleRentalToUser(userId, newId) 
        return await this.getRentalById(newId)
    },


    //Read ('get all', 'get by id')

    async getAllRental(){
        const rentalCollection = await rental()
        const rentalList = await rentalCollection.find({}).toArray()
        if(!rentalList) throw 'Error: no rental in the system'
        return rentalList
    },

    async getRentalById(id){
        if (!id) throw 'Error: You must provide an id to search for'
        if (typeof id !== 'string' || id.trim().length == 0) throw 'Error: You must provide a valid id'
        const rentalCollection = await rental()
        const thisRental = await rentalCollection.findOne({ _id: id})
        if (!thisRental) throw 'Error: Rental not found'
        return thisRental
    },

    //Update
    async updateRental(rentalId, updatedInfo){
        if (!verifier.validString(rentalId)) throw "id is not a valid string.";
    
        const rentalCollection = await rental();
        const theRental = getRentalById(rentalId);
        const updatingInfo = {
            location: updatedInfo.location, 
            price: updatedInfo.price, 
            bedroom: updatedInfo.bedroom, 
            bathroom: updatedInfo.bathroom, 
            space: updatedInfo.space, 
            description: updatedInfo.description , 
            photos: updatedInfo.photos, 
            utility: updatedInfo.utility, 
            like: theRental.like, 
            dislike: theRental.dislike, 
            labels: updatedInfo.labels, 
            contact: updatedInfo.contact
        }
        
        
        const updatedRental = await rentalCollection.updateOne(
              {_id: id},
              {$set: updatingInfo}
         )
        if(!updatedRental.matchedCount && !updatedRental.motifiedCount) throw 'updated failed.'
        
        return await this.getRentalById;
    },


    //Delete
    async deleteRental(id, userId) {
        const rentalCollection = await rental()
        const deleteInfo = await rentalCollection.removeOne({ _id: id})
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete rentalwith id of ${id}`;
        }
        await shareUtilsDB.untoggleRentalToUser(userId, id)
        return true
    }


}


module.exports = ExportedMethods

