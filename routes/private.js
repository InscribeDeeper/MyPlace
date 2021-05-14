const express = require('express');
const router = express.Router();
const verifier = require('../data/verify');
const data = require("../data");
const userData = data.users;



router.get('/', async(req, res) =>{
    const userName = req.session.user;	
    console.log("private route")
    console.log(userName)
    myUser = await userData.getUserByUserName(userName);



    // const userReviews = await reviews.getAllReviewsOfUser(userData._id);

    // Combine restaurants and reviews into one array for easier access
    // let restaurantNames = [];
    // for (let review of userReviews){
    //     let rest = await restaurants.getRestaurantById(review.restaurantId);
    //     restaurantNames.push(rest.name);
    // }

    // let reviewRest = [];
    // for (let i = 0; i < userReviews.length; i++) {
    //     let currentReview = userReviews[i];
    //     let max = 5;
    //     let price = currentReview.metrics.price;
    //     let rating = currentReview.metrics.rating
        
    //     reviewRest.push({
    //         review: currentReview, 
    //         restaurant: restaurantNames[i],
    //         filledStars: verifier.generateList(rating),
    //         unfilledStars: verifier.generateList(max-rating),
    //         filledDollars: verifier.generateList(price)
    //     });
    // }

    // // Get restaurant names of user's favorited restaurants
    // let favRestaurants = [];
    // for (let restaurantId of userData.favoritedRestaurants){
    //     let rest = await restaurants.getRestaurantById(restaurantId);
    //     favRestaurants.push({
    //         id: restaurantId, 
    //         name: rest.name
    //     });
    // }


    return res.render('users/myProfile', {
        authenticated: true,
        partial: 'user-info-script',
        title: 'Your Profile',
        user: myUser,
        favRestaurants: myUser.email,
        reviews: myUser.selfSummary
    });
});

module.exports = router;