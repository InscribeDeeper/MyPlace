

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
		_id: uuid.v4().toString(),
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
