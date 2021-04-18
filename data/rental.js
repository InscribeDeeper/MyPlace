//Yixuan Wang 04/17/2021

const mongoCollections = require('../config/mongoCollections')
const rental = mongoCollections.rental
const users = require('./users')

const ExportedMethos = {

    //create

    async addRental(location, price, bedroom, bathroom, space, description, photos, utility, like, dislike, labels, contact) {
        //check errors will be finished later

        const rentalCollection = await rental

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
        await users.addRentalToUser(bookId, newId, user, location, price, bedroom, bathroom, space, description, photos, utility, like, dislike, labels, contact)
        return await this.getRentalById(newId)
    },


    //Read ('get all', 'get by id')

    async getAllRental(){
        const rentalCollection = await rental()
        const rentalList = await rentalCollection.find({}).toArray()
        if(!rentalList) throw 'Error: no rental in the system'
        return rentalList
    },

    

}

// DB Example
// rental = {
//     "_id": "rental_id1",
//     "user_id": "user_collection_id_1",
//     "comment_id": ["comment_collection_id_101","comment_collection_id_102"],
//     "location": "123 Washington St", // google map 
//     "price": 1000,
//     "bedroom": 2,
//     "bathroom": 2,
//     "space": 85, // square feet unit should be unify
//     "description": "long paragraph string",
//     "photos": ["binary_file1", "binary_file2"],
//     "utility": "string",
//     "like": 20,
//     "dislike": 4,
//     "labels": ["warm", "big", "cheap", "luxury", "convenient", ""],
//     "contact": "vx_abcd / 155 564 1235"
// }

