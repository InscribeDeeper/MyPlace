const mongoCollections = require("../config/mongoCollections");
const furniture = mongoCollections.furniture;
// const users = mongoCollections.users;
const uuid = require("uuid");
const verifier = require("./verify");
const toggleFn = require("../data/shareUtilsDB");

async function getFurnitureById(id) {
    const furnitureCollection = await furniture();
    const theFurniture = await furnitureCollection.findOne({ _id: id });

    if (!theFurniture) throw "the book is not found in books data";
    return theFurniture;
}

async function createFurniture(userId, name, category, location, price, description, photos, likes, dislikes, purchase_link, sold, contact, latitudeFloat, longitudeFloat) {
    // add to collection
    if (!verifier.validString(userId)) throw "userId is not a valid user id.";
    if (!verifier.validString(name)) throw "userId is not a valid user id.";
//     if (!verifier.validString(category)) throw "category is not a valid category.";
//     if (!verifier.validString(location)) throw "Last name is not a valid string.";
//     if (!parseFloat(price)) throw "Price is not a valid number.";
//     if (!verifier.validString(description)) throw "userName is not a valid string.";
//     if (!verifier.validString(photo)) throw "photo is not a valid string.";
//     if (!verifier.validString(purchase_link)) throw "purchase_link is not a valid string.";
//     if (!verifier.validBoolean(sold)) throw "Sold should be a boolean";
//     if (!contact) throw "contact should be a string or a number";
//     if (!parseFloat(latitudeFloat)) throw "latitude is not a valid number.";
//     if (!parseFloat(longitudeFloat)) throw "longtitude is not a valid number.";

    let latitude = parseFloat(latitudeFloat);
    let longitude = parseFloat(longitudeFloat);
    price = parseFloat(price);
    const furnitureCollection = await furniture();
    // const userCollection = await users();
    let newFurniture = {
        _id: uuid.v4().toString(),
        user_id: userId,
        name,
        comments_id: [],
        category,
        location,
        price,
        description,
        photos,
        likes, // 储存userId
        dislikes, // 储存userId
        purchase_link,
        sold,
        contact,
        latitude,
        longitude
    };

    const newInsertedFurniture = await furnitureCollection.insertOne(newFurniture);
    if (newInsertedFurniture.insertedCount === 0) throw "Insert failed!";

    await toggleFn.toggleFurnitureToUser(userId, newFurniture._id); // ???
    return await this.getFurnitureById(newInsertedFurniture.insertedId);
}

async function getAllFurnitures() {
    const furnitureCollection = await furniture();
    const furnitureList = await furnitureCollection.find({}).toArray();
    if (!furnitureList) throw "No furniture in database";
    return furnitureList;
}

async function updataFurniture(furnitureId, updatedInfo) {
    if (!verifier.validString(furnitureId)) throw "User id is not a valid string.";

    const furnitureCollection = await furniture();
    const theFurniture = getFurnitureById(furnitureId);
    let updatingInfo = {
        category: updatedInfo.category,
        location: updatedInfo.location,
        price: updatedInfo.price,
        description: updatedInfo.description,
        photos: updatedInfo.photos,
        likes: theFurniture.likes,
        dislikes: theFurniture.dislikes,
        purchase_link: updatedInfo.purchase_link,
        sold: theFurniture.sold,
        contact: updatedInfo.contact,
    };
    const updatedFurniture = await furnitureCollection.updateOne({ _id: id }, { $set: updatingInfo });
    if (!updatedFurniture.matchedCount && !updatedFurniture.motifiedCount) throw "updated failed.";

    return await this.getFurnitureById;
}

async function deleteFurniture(id) {
    if (!verifier.validString(id)) throw "id is undefined";

    const furnitureCollection = await furnitrue();
    const deletionInfo = await furnitureCollection.deleteOne({ _id: id });
    if (deletionInfo.deletedCount == 0) throw `Furniture, ${id}, can not be deleted.`;

    return true;
}
module.exports = {
    getFurnitureById,
    createFurniture,
    getAllFurnitures,
    updataFurniture,
    deleteFurniture,
};