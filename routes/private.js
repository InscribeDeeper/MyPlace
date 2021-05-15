const express = require("express");
const router = express.Router();
const verifier = require("../data/verify");
const data = require("../data");
const { furniture } = require("../config/mongoCollections");
const userData = data.users;
const commentData = data.comments;
const furnitureData = data.furniture;
const rentalData = data.rental;

router.get("/", async (req, res) => {
	const userName = req.session.user;
	console.log("private route");
	console.log(userName);
	myUser = await userData.getUserByUserName(userName);
	// myUser._id

	//###########################
	// My Reviews History
	// this._id, this.name, this.type, this.text
	//###########################
	let reviewHistory = [];
	const myComments = myUser.comments_id || [];

	for (let eachCommmentID of myComments) {
		eachCommment = await commentData.getCommentById(eachCommmentID);
		console.log(eachCommment);
		current = {};
		current_furniture = await commentData.getFurnitureByCommentID(eachCommment._id);
		current_rental = await commentData.getRentalByCommentID(eachCommment._id);

		if (current_furniture) {
			item_type = "Furniture";
			item_name = current_furniture.name;
			item_id = current_furniture._id;
		} else {
			item_type = "Rental";
			item_name = current_rental.name;
			item_id = current_rental._id;
		}

		current._id = item_id;
		current.name = item_name;
		current.type = item_type;
		current.text = eachCommment.comment;
		reviewHistory.push(current);
	}

	//###########################
	// My ownedFurnitures
	// this._id, this.name, this.likes, this.num_comments
	//###########################
	let ownedFurnitures = [];
	const myFurnitures = myUser.furniture_id || [];

	for (let eachFurnitureID of myFurnitures) {
		current = {};
		current_furniture = await furnitureData.getFurnitureById(eachFurnitureID);
		current._id = eachFurnitureID;
		current.name = current_furniture.name;
		current.likes = current_furniture.likes;
		current.num_comments = current_furniture.comments_id.length;
		ownedFurnitures.push(current);
	}

	//###########################
	// My favoritedFurnitures
	// this._id, this.name, this.likes, this.num_comments
	//###########################
	let favoritedFurnitures = [];
	const myFavFurnitures = myUser.favor_furniture_id || [];

	for (let eachFurnitureID of myFavFurnitures) {
		current = {};
		current_furniture = await furnitureData.getFurnitureById(eachFurnitureID);
		current._id = eachFurnitureID;
		current.name = current_furniture.name;
		current.likes = current_furniture.likes;
		current.num_comments = current_furniture.comments_id.length;
		favoritedFurnitures.push(current);
	}

	//###########################
	// My ownedRentals
	// this._id, this.name, this.likes, this.num_comments
	//###########################
	let ownedRentals = [];
	const myRentals = myUser.rental_id || [];
	// for (let eachRentalID of myRentals) {
	// 	current = {};
	// 	current_rental = await rentalData.getRentalById(eachRentalID);
	//     current._id = eachRentalID;
	// 	current.name = current_rental.name;
	// 	current.likes = current_rental.likes;
	// 	current.num_comments = current_rental.comments_id.length;
	// 	ownedRentals.push(current);
	// }

	//###########################
	// My favoritedRentals
	// this._id, this.name, this.likes, this.num_comments
	//###########################
	let favoritedRentals = [];
	const myFavRentals = myUser.rental_id || [];
	// for (let eachRentalID of myFavRentals) {
	// 	current = {};
	// 	current_rental = await rentalData.getRentalById(eachRentalID);
	//     current._id = eachRentalID;
	// 	current.name = current_rental.name;
	// 	current.likes = current_rental.likes;
	// 	current.num_comments = current_rental.comments_id.length;
	// 	favoritedRentals.push(current);
	// }

	return res.render("users/myProfile", {
		authenticated: true,
		partial: "user-info-script",
		title: "Your Profile",
		user: myUser,
		reviewHistory: reviewHistory,
		ownedFurnitures: ownedFurnitures,
		ownedRentals: ownedRentals,
		favoritedFurnitures: favoritedFurnitures,
		favoritedRentals: favoritedRentals,
	});
});

module.exports = router;
