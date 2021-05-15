const express = require('express');
const router = express.Router();
const data = require('../data');
const rentalData = data.rental;
const userData = data.users;
const commentData = data.comments;
const verify = require("../data/verify");
const xss = require("xss");


router.get("/", async (req, res) => {
	const allRental = await rentalData.getAllRental();
	return res.render("rental/list", {
		category: category,
		title: "All Rentals",
		rental: allRental,
		authenticated: req.session.user ? true : false,
		user: req.session.user,
		partial: "rentals-list-script",
	});
});

router.get("/new", async (req, res) => {
	return res.render("rental/new", {
		title: "New Rental",
		authenticated: req.session.user ? true : false,
		user: req.session.user,
		hasErrors: false,
		errors: null,
		partial: "rentals-form-script",
	});
});

router.post("/new", async (req, res) => {
	// 
	
	let location = xss(req.body.location);
	let price = xss(req.body.price);
    let bedroom = xss(req.body.bedroom);
    let bathroom = xss(req.body.bathroom);
    let space = xss(req.body.space);
	let description = xss(req.body.description);
	let photo_link = xss(req.body.photo_link);
    let utility = xss(req.body.utility);
	let labels = xss(req.body.labels);
	let contact = xss(req.body.contact);
    //location longitute latitute like dislike???

	let errors = [];

	
	if (!location) errors.push("Invalid location.");
	if (!price) errors.push("No price added.");
    if (!bedroom) errors.push("No bed added.");
    if (!bathroom) errors.push("No bath added.");
    if (!space) errors.push("No space added.");
    if (!description) errors.push("No description added.");
	if (!photo_link) errors.push("photos strongly recommended");
	if (!utility) errors.push("No utility added");
    if (!labels) errors.push("No labels added.");
	if (!contact) errors.push("No contact");

	
	if (errors.length > 0) {
		return res.render("rental/new", {
			title: "New Rental",
			authenticated: req.session.user ? true : false,
			user: req.session.user,
			hasErrors: true,
			errors: errors,
			reqInput: req.body,
			partial: "errors-script",
		});
	}

	try {
		const newFurniture = await furnitureData.createFurniture(
			
			location,
			price,
            bedroom,
            bathroom,
            space,
			description,
			photo_link,
            utility,
			0,
			0,
			labels,
			contact,
            longitutue,
            latitute,
            myUser._id
		);
		res.redirect(`/furniture`);
	} catch (e) {
		return res.render("rental/new", {
			title: "New Rental",
			authenticated: req.session.user ? true : false,
			user: req.session.user,
			hasErrors: true,
			errors: errors,
			reqInput: req.body,
			partial: "errors-script",
		});
	}
});

// Search for a specific rental
router.get("/:id", async (req, res) => {
	if (!req.session.user) {
		req.session.previousRoute = req.originalUrl;
		res.redirect("/users/login");
		return;
	}

	var rentalID = req.params.id.trim();
	var errors = [];
	var allComments = [];

	// get user
	const userName = req.session.user;
	try {
		myUser = await userData.getUserByUserName(userName);
	} catch (e) {
		errors.push("userName or password is not valid.");
	}

	if (!verify.validString(rentalID)) {
		errors.push("Id of the rental must be provided");
		return res.render("errors/error", {
			title: "Errors",
			partial: "errors-script",
			errors: errors,
		});
	}

	try {
		const rental = await furnitureData.getRentalById(rentalID);
		const commentsIdList = furniture.comments_id || [];

		if (commentsIdList.length > 0) {
			allComments = await Promise.all(
				commentsIdList.map(async (x) => {
					return await commentData.getCommentById(x);
				})
			);
		}

		var allCommentsProcessed = [];
		var userArr = [];
		for (let eachCommment of allComments) {
			let current = {};

			let commentedUser = await userData.getUserById(eachCommment.user_id); // get each comment's owner
			// current.id = review._id;
			current.name = commentedUser.first_name + " " + commentedUser.last_name;
			current.age = commentedUser.age;
			current.text = eachCommment.comment;
			current.helpful = eachCommment.helpful;
			current.reported = eachCommment.report; // checkListMem ../user._id this.reported

			// let allsubComments = await commentData.getAllCommentsOfReview(eachCommment._id);
			let subComments = [];
			// for (let eachsubcomment of allsubComments) {
			//     let currentComment = {};
			//     let {firstName, lastName, age} = await userData.getUserById(eachsubcomment[0]);
			//     currentComment.name = firstName + ' ' + lastName;
			//     currentComment.age = age;
			//     currentComment.text = comment.text
			//     subComments.push(currentComment);
			// }
			current.subcomments = subComments;

			// let max = 5;
			// current.filledStars = verify.generateList(current.metrics.rating);
			// current.unfilledStars = verify.generateList(max - current.metrics.rating);
			// current.filledDollars = verify.generateList(current.metrics.price);
			allCommentsProcessed.push(current);
		}

		// Calculate percentages for ratings based off of reviews
		const numComments = allCommentsProcessed.length;
		// furniture.rating = (furniture.rating / numReviews).toFixed(2);
		// furniture.price = (furniture.price / numReviews).toFixed(2);
		// furniture.distancedTables = ((furniture.distancedTables / numReviews) * 100).toFixed(2);
		// furniture.maskedEmployees = ((furniture.maskedEmployees / numReviews) * 100).toFixed(2);
		// furniture.noTouchPayment = ((furniture.noTouchPayment / numReviews) * 100).toFixed(2);
		// furniture.outdoorSeating = ((furniture.outdoorSeating / numReviews) * 100).toFixed(2);

		// Get the furniture's photos from calling Yelp API
		// const client = yelp.client(apiKey);
		// const matchRequest = {
		//     name: furniture.name,
		//     address1: furniture.address,
		//     city: 'Hoboken',
		//     state: 'NJ',
		//     country: 'US'
		// };

		// // Get the furniture's photos from calling googleMap API
		// const matchRes = await client.businessMatch(matchRequest);
		// const jsonRes = matchRes.jsonBody;
		// let results = jsonRes.businesses;
		// let result = results[0];
		// let photos = [];
		// if (results.length > 0) {
		//     const businessRes = await client.business(result.id);
		//     const jsonRes2 = businessRes.jsonBody;
		//     photos = jsonRes2.photos;
		// }

		photos = null;

		res.render("rental/single", {
			partial: "rentals-single-script",
			title: "Rental",
			authenticated: req.session.user ? true : false,
			user: userArr, // obj
			rental: rental, // obj
			comments: allCommentsProcessed, // arr
			photos: photos,
		});
	} catch (e) {
		errors.push(e);
		res.status(500).render("errors/error", {
			title: "Errors",
			partial: "errors-script",
			errors: errors,
		});
	}
});

module.exports = router;