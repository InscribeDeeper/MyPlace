// Furniture = {
//     "_id": "furniture_id1",
//     "user_id": "user_collection_id_1",
//     "comment_id": ["comment_collection_id_1232", "comment_collection_id_1234",],
//     "category": ["electronics", "computer"], // refer amazon
//     "location": "1253 Garden St", // google map
//     "price": 10,
//     "description": "long paragraph string", // used age 4/10  // search by descrption match
//     "photos": ["binary_file1", "binary_file2"],
//     "like": 20,
//     "dislike": 4,
//     "purchase_link": "https://www.amazon.com/gp/product/B07TZSCDJD/ref=ppx_yo_dt_b_asin_image_o00_s00?ie=UTF8&psc=1",
//     "sold": FALSE,
//     "contact": "vx_abcd / 155 564 1235"
// }

const mongoCollections = require("../config/mongoCollections");
const furniture = mongoCollections.furniture;
const uuid = require("uuid");

async function getByFurnitureId(id) {
	const furnitureCollection = await furniture();
	const theFurniture = await furnitureCollection.findOne({ _id: id });

	if (!theFurniture) throw "the book is not found in books data";
	return theFurniture;
}

async function Create(category, location, price, description, photos, likes, dislike, purchase_link, sold, contact) {
	// add to collection
	const furnitureCollection = await furniture();

	let newFurniture = {
		_id: uuid.v4(),
		comment_id: [],
		category,
		location,
		price,
		description,
		photos,
		likes,
		dislike,
		purchase_link,
		sold,
		contact,
	};
	// console.log(typeof newBook._id + "book")
	console.log("error1");
	const newInsertedFurniture = await furnitureCollection.insertOne(newFurniture);
	if (newInsertedFurniture.insertedCount === 0) throw "Insert failed!";
	return await this.getByFurnitureId(newInsertedFurniture.insertedId);
}

module.exports = {
	getByFurnitureId,
	Create,
};
