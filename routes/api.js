const express = require("express");
const router = express.Router();
const data = require("../data");
const commentData = data.comments;
const userData = data.users;
const verifier = require("../data/verify");
const xss = require("xss");
let { ObjectId } = require("mongodb");

router.post("/deleteComment/:type/:item_id/:comment_id", async function (req, res) {
	// 需要用户的 id, type / comment id/ furniture_id
    let errors = [];
    if (!req.session.user) errors.push("Must log in to comment.");

	const userName = req.session.user;
	myUser = await userData.getUserByUserName(userName);

	const type = xss(req.body.type.trim());
	const item_id = xss(req.body.item_id.trim());
	const comment_id = xss(req.body.comment_id.trim());
	const user_id = myUser._id;

	await commentData.deleteComment(comment_id);
	await toggleFn.untoggleCommentToUser(user_id, comment_id);
	if (type === "Furniture") {
		await toggleFn.untoggleCommentToFurniture(item_id, comment_id);
	} else if  (type === "Rental") {
		await toggleFn.untoggleCommentToRental(item_id, comment_id);
	} else{
        errors.push("No data-type pass in")
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

router.post("/like/:rid/:uid", async function (req, res) {
	const rid = xss(req.body.rid.trim());
	const uid = xss(req.body.uid.trim());
	const parsedRid = ObjectId(rid);
	const parsedUid = ObjectId(uid);
	const review = await reviewData.getReviewById(rid);
	const update = await reviewData.updateReviewLike(rid, uid, review.likes.includes(uid) ? null : true);
	const updatedRev = await reviewData.getReviewById(rid);

	res.status(200).json({
		likeNum: updatedRev.likes.length.toString(),
		dislikeNum: updatedRev.dislikes.length.toString(),
		success: true,
	});
});

router.post("/dislike/:rid/:uid", async function (req, res) {
	const rid = xss(req.body.rid.trim());
	const uid = xss(req.body.uid.trim());
	const parsedRid = ObjectId(rid);
	const parsedUid = ObjectId(uid);
	const review = await reviewData.getReviewById(rid);
	const update = await reviewData.updateReviewLike(rid, uid, review.dislikes.includes(uid) ? null : false);
	const updatedRev = await reviewData.getReviewById(rid);

	res.status(200).json({
		likeNum: updatedRev.likes.length.toString(),
		dislikeNum: updatedRev.dislikes.length.toString(),
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

router.post("/report/:rid/:uid/:restid", async function (req, res) {
	const rid = xss(req.body.rid.trim());
	const uid = xss(req.body.uid.trim());
	const restId = xss(req.body.restId.trim());
	const parsedRid = ObjectId(rid);
	const parsedUid = ObjectId(uid);
	const parsedRestId = ObjectId(restId);

	const deleted = await reviewData.updateReviewReport(rid, uid);
	const restaurant = await restaurantData.getRestaurantById(restId);
	const allReviews = await reviewData.getAllReviewsOfRestaurant(restId);
	const numReviews = allReviews.length;
	restaurant.rating = (restaurant.rating / numReviews).toFixed(2);
	restaurant.price = (restaurant.price / numReviews).toFixed(2);
	restaurant.distancedTables = ((restaurant.distancedTables / numReviews) * 100).toFixed(2);
	restaurant.maskedEmployees = ((restaurant.maskedEmployees / numReviews) * 100).toFixed(2);
	restaurant.noTouchPayment = ((restaurant.noTouchPayment / numReviews) * 100).toFixed(2);
	restaurant.outdoorSeating = ((restaurant.outdoorSeating / numReviews) * 100).toFixed(2);
	res.status(200).json({
		success: true,
		deleted: deleted,
		restaurant: restaurant,
	});
});

router.post("/comment/new", async (req, res) => {
	let errors = [];
	let reviewId = xss(req.body.reviewId.trim());
	let text = xss(req.body.text.trim());

	if (!req.session.user) errors.push("Must log in to comment.");
	let userId = req.session.user._id;
	if (!verifier.validString(reviewId)) errors.push("Invalid comment review id.");
	if (!verifier.validString(userId)) errors.push("Invalid comment user id.");
	if (!verifier.validString(text)) errors.push("Invalid comment text.");

	if (errors.length > 0) {
		res.status(500).json({
			success: false,
			errors: errors,
			message: "Errors encountered",
		});
	}

	try {
		const comment = await commentData.createComment(reviewId, userId, text);
		// Get user info
		let { username, age, firstName, lastName } = await userData.getUserById(userId);
		let commentLayout = {
			name: firstName + " " + lastName,
			text: comment.text,
		};
		res.render("partials/comment_item", { layout: null, ...commentLayout });
	} catch (e) {
		errors.push(e);
		res.status(500).json({
			success: false,
			errors: errors,
		});
	}
});

module.exports = router;
