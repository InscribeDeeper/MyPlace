const express = require("express");
const router = express.Router();
const data = require("../data");
const furnitureData = data.furniture;
const userData = data.users;
const commentData = data.comments;
const verify = require("../data/verify");
const xss = require("xss");
const toggleFn = data.toggleFn;

router.get("/", async (req, res) => {
	// Redirect the user to login page if they attempt to create a review without logging in
	// Use req.session to store the redirect address after logging in
	res.render("comments/create");
});

//应该放入furniture下
router.get("/addComment/:id", async (req, res) => {
	// Redirect the user to login page if they attempt to create a review without logging in
	// Use req.session to store the redirect address after logging in
	if (!req.session.user) {
		req.session.previousRoute = req.originalUrl;
		res.redirect("/users/login");
		return;
	}

	// Clear the previousRoute in req.session if it exists
	let errors = [];
	let furnitureId = req.params.id.trim();
	if (!verify.validString(furnitureId)) {
		errors.push("No id was provided to 'funiture/addComment/:id' route.");
		res.render("errors/error", {
			title: "Errors",
			errors: errors,
			partial: "errors-script",
		});
	}

	try {
		//pull评论
		const furniture = await furnitureData.getFurnitureById(furnitureId);
		res.render("comments/create", {
			partial: "write-a-review-script",
			title: "Write a Review",
			authenticated: req.session.user ? true : false,
			user: req.session.user,
			furniture: furniture,
		});
	} catch (e) {
		errors.push(e);
		res.status(500).render("errors/error", {
			title: "Errors",
			errors: errors,
			partial: "errors-script",
		});
	}
});

router.post("/report/:id", async (req, res) => {
	const userName = req.session.user;
	myUser = await userData.getUserByUserName(userName);
	const userId = myUser._id;
	const commentId = xss(req.params.id.trim());

	try {
		reported = await commentData.reportComment(commentId, userId);
	} catch (e) {
		errors.push(e);
		res.status(500).json({ error: e });
	}
});

router.post("/helpful/:id", async (req, res) => {
	const userName = req.session.user;
	myUser = await userData.getUserByUserName(userName);
	const userId = myUser._id;
	const commentId = xss(req.params.id.trim());

	try {
		reported = await commentData.helpfulComment(commentId, userId);
	} catch (e) {
		errors.push(e);
		res.status(500).json({ error: e });
	}
});

// User should only be able to access POST route after logging in
router.post("/addComment/:id", async (req, res) => {
	// Validate input in this route before sending to server
	

	let errors = [];
	let furnitureId = xss(req.params.id.trim());
	if (!verify.validString(furnitureId)) errors.push("not a valid furnitureId")
	
	// Everything in req.body is a string
	const userName = req.session.user;
	myUser = await userData.getUserByUserName(userName);
	const userId = myUser._id;
	const comment = xss(req.body.reviewText);

	try {
		newComment = await commentData.addComments(userId, comment);
		await toggleFn.toggleCommentToUser(userId, newComment._id);
		// if ( req.session.previousRoute 是furniture 还是 rental)
		await toggleFn.toggleCommentToFurniture(furnitureId, newComment._id);
		// if ( req.session.previousRoute 是furniture 还是 rental)
		
		res.redirect(`../../furniture/${furnitureId}`);
	} catch (e) {
		errors.push(e);
		res.status(500).render("errors/error", {
			errors: errors,
			partial: "errors-script",
		});
		// res.status(500).json({  error:  e  });
	}
});

module.exports = router;

//test later
// Route-side input validation
// let errors = [];
// if (!req.session.user) errors.push('User is not logged in!');
// if (!verify.validRating(newMetrics.rating)) errors.push('Invalid review rating.');
// if (!verify.validRating(newMetrics.price)) errors.push('Invalid review price.');
// if (!verify.validString(newReviewText)) errors.push('Invalid review text.');

// if (errors.length > 0) {
//     res.render('errors/error', {
//         title: 'Write a Review',
//         errors: errors,
//         partial: 'errors-script'
//     });
//     return;
// }
// await commentData.addComments(userId, comment);
