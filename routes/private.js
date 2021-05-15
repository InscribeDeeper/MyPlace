const express = require('express');
const router = express.Router();
const verifier = require('../data/verify');
const data = require("../data");
const userData = data.users;
const commentData = data.comments;


router.get('/', async(req, res) =>{
    const userName = req.session.user;	
    console.log("private route")
    console.log(userName)
    myUser = await userData.getUserByUserName(userName);
    // myUser._id

    const commentsIdList = myUser.comments_id || [];

    if (commentsIdList.length > 0) {
        allComments = await Promise.all(
            commentsIdList.map(async (x) => {
                return await commentData.getCommentById(x);
            })
        );
    }

    

    // // Combine restaurants and reviews into one array for easier access
    // let restaurantNames = [];
    // for (let comment of allComments){
    //     通过comment id 找到 furniture_id
    //     // let rest = await restaurants.getRestaurantById(comment.restaurantId);
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