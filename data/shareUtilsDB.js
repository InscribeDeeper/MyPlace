const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const verify = require("./verify");

async function getUserById(user_id) {
	if (!verify.validString(user_id)) throw "User id is not a valid string.";
	const userCollection = await users();
	let user = await userCollection.findOne({ _id: user_id });
	if (user === null) throw `user not found with id: ${user_id}`;
	return user;
}

async function toggleRentalToUser(user_id, rental_id) {
	if (!verify.validString(user_id)) throw "User id is not a valid string.";
	if (!verify.validString(rental_id)) throw "rental_id id is not a valid string.";
	const userCollection = await users();
	const updatedInfo = await userCollection.updateOne({ _id: user_id }, { $addToSet: { rental_id: rental_id } });
	if (updatedInfo.modifiedCount === 0) throw "Could not update rentalId in User collection successfully.";
	return await getUserById(user_id);
}

async function toggleCommentToUser(user_id, comment_id) {
	if (!verify.validString(user_id)) throw "User id is not a valid string.";
	if (!verify.validString(comment_id)) throw "comment_id id is not a valid string.";
	const userCollection = await users();
	const updatedInfo = await userCollection.updateOne({ _id: user_id }, { $addToSet: { comment_id: comment_id } });
	if (updatedInfo.modifiedCount === 0) throw "Could not update comment_id in User collection successfully.";
	return await getUserById(user_id);
}

async function toggleFurnitureToUser(user_id, furniture_id) {
	if (!verify.validString(user_id)) throw "User id is not a valid string.";
	if (!verify.validString(furniture_id)) throw "furniture_id id is not a valid string.";
	const userCollection = await users();
	const updatedInfo = await userCollection.updateOne({ _id: user_id }, { $addToSet: { furniture_id: furniture_id } });
	if (updatedInfo.modifiedCount === 0) throw "Could not update furniture_id in User collection successfully.";
	return await getUserById(user_id);
}

async function untoggleRentalToUser(user_id, rental_id) {
	if (!verify.validString(user_id)) throw "User id is not a valid string.";
	if (!verify.validString(rental_id)) throw "rental_id id is not a valid string.";
	const userCollection = await users();
	const updatedInfo = await userCollection.updateOne({ _id: user_id }, { $pull: { rental_id: rental_id } });
	if (updatedInfo.modifiedCount === 0) throw "Could not update rentalId in User collection successfully.";
	return await getUserById(user_id);
}

async function untoggleCommentToUser(user_id, comment_id) {
	if (!verify.validString(user_id)) throw "User id is not a valid string.";
	if (!verify.validString(comment_id)) throw "comment_id id is not a valid string.";
	const userCollection = await users();
	const updatedInfo = await userCollection.updateOne({ _id: user_id }, { $pull: { comment_id: comment_id } });
	if (updatedInfo.modifiedCount === 0) throw "Could not update comment_id in User collection successfully.";
	return await getUserById(user_id);
}

async function untoggleFurnitureToUser(user_id, furniture_id) {
	if (!verify.validString(user_id)) throw "User id is not a valid string.";
	if (!verify.validString(furniture_id)) throw "furniture_id id is not a valid string.";

	const userCollection = await users();
	const updatedInfo = await userCollection.updateOne({ _id: user_id }, { $pull: { furniture_id: furniture_id } });
	if (updatedInfo.modifiedCount === 0) throw "Could not update furniture_id in User collection successfully.";
	return await getUserById(user_id);
}

// async function untoggleCommentToUser(user_id, furniture_id) {
// 	if (!verify.validString(user_id)) throw "User id is not a valid string.";
// 	if (!verify.validString(furniture_id)) throw "furniture_id id is not a valid string.";

// 	const userCollection = await users();
// 	const updatedInfo = await userCollection.updateOne({ _id: user_id }, { $pull: { furniture_id: furniture_id } });
// 	if (updatedInfo.modifiedCount === 0) throw "Could not update furniture_id in User collection successfully.";
// 	return await getUserById(user_id);
// }

module.exports = {
	toggleRentalToUser,
	toggleCommentToUser,
	toggleFurnitureToUser,
	untoggleRentalToUser,
	untoggleCommentToUser,
	untoggleFurnitureToUser,
};
