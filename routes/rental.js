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
	let longitute = xss(req.body.longitute);
	let latitute = xss(req.body.latitute);
    

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
	if (!latitute) errors.push("No latitude.");
	if (!longitute) errors.push("No contact");
	
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

	const userName = req.session.user;
	try {
		myUser = await userData.getUserByUserName(userName);
	} catch (e) {
		errors.push("userName or password is not valid.");
	}
	
	try {
		
		
		const newRental = await rentalData.createRental(
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
            longitute,
            latitute,
            myUser._id
		);
		
		res.redirect(`/rental`);
		
	} catch (e) {
		console.log("fial")
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
		const rental = await rentalData.getRentalById(rentalID);
		const commentsIdList = rental.comments_id || [];

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
			current._id = eachCommment._id;
			current.name = commentedUser.firstName + " " + commentedUser.lastName;
			current.age = commentedUser.age;
			current.text = eachCommment.comment;
			current.helpful = eachCommment.helpful;
			current.reported = eachCommment.report; 

			let subComments = [];
			
			current.subcomments = subComments;

			allCommentsProcessed.push(current);
		}

	
		const numComments = allCommentsProcessed.length;
		

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