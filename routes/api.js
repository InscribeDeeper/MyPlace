const express = require("express");
const router = express.Router();
const data = require("../data");
const commentData = data.comments;
const userData = data.users;
const verifier = require("../data/verify");
const xss = require("xss");
const toggleFn = require("../data/shareUtilsDB");

let { ObjectId } = require("mongodb");

router.post("/deleteComment/:type/:comment_id", async function (req, res) {
	// 需要用户的 id, type / comment id/ furniture_id

	let errors = [];
	if (!req.session.user) errors.push("Must log in to comment.");

	const userName = req.session.user;
	myUser = await userData.getUserByUserName(userName);

	const type = xss(req.body.type.trim()); // req.params.type
	const item_id = xss(req.body.item_id.trim());
	const comment_id = xss(req.body.comment_id.trim()); // req.params.comment_id
	const user_id = myUser._id;
	await commentData.deleteComment(comment_id);
	await toggleFn.untoggleCommentToUser(user_id, comment_id);
	if (type === "Furniture") {
		await toggleFn.untoggleCommentToFurniture(item_id, comment_id);
	} else if (type === "Rental") {
		await toggleFn.untoggleCommentToRental(item_id, comment_id);
	} else {
		errors.push("No data-type pass in");
	}

	// const rid = xss(req.body.id.trim());
	// const parsedId = ObjectId(rid);
	// const delReview = await reviewData.deleteReview(rid);
	// const reviewList = await reviewData.getAllReviewsOfUser(delReview.reviewerId);
	// let empty = false;
	// if (reviewList.length == 0) {
	// 	empty = true;
	// }
	res.status(200).json({
		success: true,
	});
});

router.post("/favorite/:rid/:uid", async function (req, res) {
	const rid = xss(req.body.rid.trim());
	const uid = xss(req.body.uid.trim());
	const parsedRid = ObjectId(rid);
	const parsedUid = ObjectId(uid);
	const update = await userData.toggleFavoriteRestaurant(uid, rid);

	//update session user to display on user page
	req.session.user = await userData.getUserById(uid);

	res.status(200).json({
		success: true,
	});
});



module.exports = router;
