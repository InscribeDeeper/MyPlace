const express = require('express');
const router = express.Router();
const data = require('../data');
const furnitureData = data.furniture;
const userData = data.users;
const commentData = data.comments;
const verify = require('../data/verify');
const xss = require('xss');

// let cuisineTypes = ['American', 'Breakfast', 'Brunch', 'Chinese', 'Fast Food', 'Italian',
//     'Mexican', 'Thai', 'Korean', 'Middle-Eastern', 'Indian', 'Soul Food',
//     'French', 'Japanese', 'Vietnamese', 'Mediterranean', 'Cuban', 'Sichuan',
//     'Greek', 'Halal','Other'
// ];
// cuisineTypes.sort();

// Route for the page of all restaurants
// /furniture  需要显示所有的 furniture的list, 是一个 table, 包含大部分furniture的 属性
router.get('/', async (req, res) => {
    
    // const restaurants = await restaurantData.getAllRestaurants();
    // restaurants.forEach(async (restaurant)=>{
    //     allReviews = await reviewData.getAllReviewsOfRestaurant(restaurant._id);
    //     numReviews = allReviews.length;
    //     restaurant.rating = (restaurant.rating / numReviews).toFixed(2);
    //     restaurant.price = (restaurant.price / numReviews).toFixed(2);
    //     if (numReviews === 0) {
    //         restaurant.rating = 'No Reviews';
    //         restaurant.price = 'No Reviews';
    //     }
    // });
    // return res.render('restaurants/list', { 
    //     authenticated: req.session.user ? true : false, // 这里会进行 认证
    //     user: req.session.user,
    //         title: 'All Restaurants',
    //         partial: 'restaurants-list-script', 
    //         restaurants: restaurants
    // });
});
/**
 * show all furniures in '/Furnitures'
 */
 
router.get('/', async (req, res) => {  // 查看网页
    
    const allFurnitures = await furnitureData.getAllFurnitures();

    return res.render('furnitures/list', { 
            // cuisines: cuisineTypes,
            title: 'All Furnitures',
            furnitures: allFurnitures,                             
            // authenticated: req.session.user? true : false,
            authenticated: true // 
            // user: req.session.user,
            // partial: 'restaurants-form-script'
    });
});

// Route to create a restaurant
router.post('/new', async (req, res) => { // 上传新建
    let category = xss(req.body.category);
    let location = xss(req.body.location);
    let price = xss(req.body.price);
    let description = xss(req.body.description);
    let photos = xss(req.body.photos);
    let purchase_link = xss(req.body.purchase_link);

    let errors = [];
    if (!category) errors.push('Invalid furniture category.');
    if (!location) errors.push('Invalid location.');
    if (!price) errors.push('No price added.');
    if (!photos) errors.push('photos strongly recommended');

    // const allRestaurants = await restaurantData.getAllRestaurants();
    // for (let x of allRestaurants) {
    //     if (x.address.toLowerCase() === newAddress.toLowerCase()) errors.push('A restaurant with this address already exists.');
    // }

    // Do not submit if there are errors in the form
    if (errors.length > 0) {
        return res.render('furniture/new', {
            title: 'New Furniture',
            authenticated: req.session.user ? true : false,
            user: req.session.user,
            hasErrors: true,
            errors: errors
        });
    }

    try {
        const newFurniture = await furnitureData.createFurniture(req.params._id, category, location, price, description, photos, 0, 0, purchase_link, false, contact);
        res.redirect(`/furniture`);
    } catch(e) {
        res.status(500).json({error: e});
    }
});

// Search for a specific restaurant
router.get('/:id', async (req, res) => {
    let id = req.params.id.trim();
    let errors = [];
    if (!verify.validString(id)) {
        errors.push('Id of the furniture must be provided')
        return res.render('errors/error', {
            title: 'Errors',
            // partial: 'errors-script',
            errors: errors
        });
    }
    
    try {
        const furniture = await furnitureData.getFurnitureById(id);
        const allComments = await commentData.getAllComments(id);
        
        // Reviews will be a list of objects s.t. each object will hold all the info for a single review
        /*
            {
                username: "sgao",
                age: 20,
                text: "Oh wow this is a great restaurant",
                metrics : {subdocument of metrics},
                comments: []
            }
        */
        const comments = [];
        for (let eachCommment of allComments) {
            let current = {};

            let commentedUser = await userData.getUserById(eachCommment._id); // get each comment's owner
            // current.id = review._id;
            current.name = commentedUser.first_name + ' ' + commentedUser.last_name;
            current.age = commentedUser.age;
            // current.text = eachCommment.comment;
            // current.metrics = review.metrics;
            // current.likes = review.likes;
            // current.dislikes = review.dislikes;
            // current.reported = review.reported;

            // let allComments = await commentData.getAllCommentsOfReview(review._id);
            // let comments = [];
            // for (const comment of allComments) {
            //     let currentComment = {};
            //     let {firstName, lastName, age} = await userData.getUserById(comment.userId);
            //     currentComment.name = firstName + ' ' + lastName;
            //     currentComment.age = age;
            //     currentComment.text = comment.text
            //     comments.push(currentComment);
            }
            current.comments = comment;

            // let max = 5;
            // current.filledStars = verify.generateList(current.metrics.rating);
            // current.unfilledStars = verify.generateList(max - current.metrics.rating);
            // current.filledDollars = verify.generateList(current.metrics.price)
            // reviews.push(current);
        // }

        // Calculate percentages for ratings based off of reviews
        // const numReviews = allReviews.length;
        // restaurant.rating = (restaurant.rating / numReviews).toFixed(2);
        // restaurant.price = (restaurant.price / numReviews).toFixed(2);
        // restaurant.distancedTables = ((restaurant.distancedTables / numReviews) * 100).toFixed(2);
        // restaurant.maskedEmployees = ((restaurant.maskedEmployees / numReviews) * 100).toFixed(2);
        // restaurant.noTouchPayment = ((restaurant.noTouchPayment / numReviews) * 100).toFixed(2);
        // restaurant.outdoorSeating = ((restaurant.outdoorSeating / numReviews) * 100).toFixed(2);

        // Get the restaurant's photos from calling Yelp API
        // const client = yelp.client(apiKey);
        // const matchRequest = {
        //     name: restaurant.name,
        //     address1: restaurant.address,
        //     city: 'Hoboken',
        //     state: 'NJ',
        //     country: 'US'
        // };

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

        res.render('furnitures/single', {
            // partial: 'restaurants-single-script',
            title: "Furniture",
            // authenticated: req.session.user ? true : false,
            authenticated: true,
            user: req.session.user,
            restaurant: restaurant,
            reviews: reviews,
            photos: photos
        });
    } catch(e) {   
        errors.push(e);
        res.status(500).render('errors/error', {
            title: 'Errors',
            // partial: 'errors-script',
            errors: errors
        });
    }
});

module.exports = router;