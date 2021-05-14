const express = require('express');
const router = express.Router();
const data = require('../data');
const furnitureData = data.furniture;
const userData = data.users;
const commentData = data.comments;
const verify = require('../data/verify');
const xss = require('xss');


router.get('/', async(req, res) => {
    // Redirect the user to login page if they attempt to create a review without logging in 
    // Use req.session to store the redirect address after logging in
    res.render('comments/create')
    })


router.get('/addComment/:id', async(req, res) => {
    // Redirect the user to login page if they attempt to create a review without logging in 
    // Use req.session to store the redirect address after logging in
    if (!req.session.user) {
        req.session.previousRoute = req.originalUrl;
        res.redirect('/users/login');
        return;
    }


    // Clear the previousRoute in req.session if it exists
    let errors = [];
    let furnitureId = req.params.id.trim();
    if (!verify.validString(furnitureId)) {
        errors.push("No id was provided to 'funiture/addComment/:id' route.");
        res.render('errors/error', {
            title: 'Errors',
            errors: errors,
            partial: 'errors-script'
        });
    }

    try { //pull评论
        const comment = await commentData.getCommentById(furnitureId);
        res.render('reviews/create', {
            partial: 'write-a-review-script',
            title: 'Write a Review',
            authenticated: req.session.user ? true : false,
            user: req.session.user,
            restaurant: restaurant
        });
    } catch (e) {
        errors.push(e)
        res.status(500).render('errors/error', {
            title: 'Errors',
            errors: errors,
            partial: 'errors-script'
        });
    }
});


// User should only be able to access POST route after logging in
router.post('/addComment/:id', async(req, res) => {
    // Validate input in this route before sending to server
    let restaurantId = xss(req.params.id.trim());
    if (!verify.validString(restaurantId)) res.render('errors/errror', { errorMessage: "Invalid restaurant id." });

    // Everything in req.body is a string
    const newRating = parseInt(xss(req.body.reviewRating));
    const newPrice = parseInt(xss(req.body.reviewPrice));
    const newDistanced = xss(req.body.distancedTables);
    const newMasked = xss(req.body.maskedEmployees);
    const newPayment = xss(req.body.noTouchPayment);
    const newSeating = xss(req.body.outdoorSeating);
    const newReviewText = xss(req.body.reviewText);

    const newMetrics = {
        rating: newRating,
        price: newPrice,
        distancedTables: !!newDistanced,
        maskedEmployees: !!newMasked,
        noTouchPayment: !!newPayment,
        outdoorSeating: !!newSeating
    };

    // Route-side input validation
    let errors = [];
    if (!req.session.user) errors.push('User is not logged in!');
    if (!verify.validRating(newMetrics.rating)) errors.push('Invalid review rating.');
    if (!verify.validRating(newMetrics.price)) errors.push('Invalid review price.');
    if (!verify.validString(newReviewText)) errors.push('Invalid review text.');

    if (errors.length > 0) {
        res.render('errors/error', {
            title: 'Write a Review',
            errors: errors,
            partial: 'errors-script'
        });
        return;
    }

    try {
        const restaurant = await restaurantData.getRestaurantById(restaurantId);
        const review = await reviews.createReview(req.session.user._id, restaurantId, newReviewText, newMetrics);
        res.redirect(`../../restaurants/${restaurantId}`);
    } catch (e) {
        errors.push(e);
        res.status(500).render('errors/error', {
            errors: errors,
            partial: 'errors-script'
        });
    }
});

module.exports = router;