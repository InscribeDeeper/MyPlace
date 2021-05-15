const express = require("express");
const router = express.Router();
const data = require("../data");
const furnitureData = data.furniture;
const userData = data.users;
const commentData = data.comments;
const verify = require("../data/verify");
const xss = require("xss");

// let category = [
// 	"American",
// 	"Breakfast",
// 	"Brunch",
// 	"Chinese",
// 	"Fast Food",
// 	"Italian",
// 	"Mexican",
// 	"Thai",
// 	"Korean",
// 	"Middle-Eastern",
// 	"Indian",
// 	"Soul Food",
// 	"French",
// 	"Japanese",
// 	"Vietnamese",
// 	"Mediterranean",
// 	"Cuban",
// 	"Sichuan",
// 	"Greek",
// 	"Halal",
// 	"Other",
// ];
// category.sort();

// Route for the page of all restaurants
// /furniture  需要显示所有的 furniture的list, 是一个 table, 包含大部分furniture的 属性
// router.get('/', async (req, res) => {

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
// });

router.get("/", async(req, res) => {
    const allFurnitures = await furnitureData.getAllFurnitures();
    return res.render("furniture/list", {
        // category: category,
        title: "All Furnitures",
        furniture: allFurnitures,
        authenticated: req.session.user ? true : false,
        user: req.session.user,
        partial: "furnitures-list-script",
    });
});

router.get("/new", async(req, res) => {
    return res.render("furniture/new", {
        title: "New Furniture",
        authenticated: req.session.user ? true : false,
        user: req.session.user,
        hasErrors: false,
        errors: null,
        partial: "furnitures-form-script",
    });
});

router.post("/new", async(req, res) => {
    // 上传新建
    let name = xss(req.body.name);
    let category = xss(req.body.category);
    let location = xss(req.body.location);
    let price = xss(req.body.price);
    let description = xss(req.body.description);
    let photo_link = xss(req.body.photo_link);
    let purchase_link = xss(req.body.purchase_link);
    let contact = xss(req.body.contact);
    let latitude = xss(req.body.latitude);
	let longitude = xss(req.body.longitude);

    let errors = [];

    if (!name) errors.push("Invalid furniture name.");
    if (!category) errors.push("Invalid furniture category.");
    if (!location) errors.push("Invalid location.");
    if (!price) errors.push("No price added.");
    if (!photo_link) errors.push("photos strongly recommended");
    if (!purchase_link) errors.push("purchase_link strongly recommended");
    if (!contact) errors.push("No contact");
    if (!latitude) errors.push("latitude is required");
    if (!longitude) errors.push("longtitude is required");

    // const allRestaurants = await restaurantData.getAllRestaurants();
    // for (let x of allRestaurants) {
    //     if (x.address.toLowerCase() === newAddress.toLowerCase()) errors.push('A restaurant with this address already exists.');
    // }

    // Do not submit if there are errors in the form
    if (errors.length > 0) {
        return res.render("furniture/new", {
            title: "New Furniture",
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
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    try {
        await furnitureData.createFurniture(
            myUser._id,
            name,
            [],
            category,
            location,
            price,
            description,
            photo_link,
            0,
            0,
            purchase_link,
            false,
            contact,
            latitude,
			longitude
        );

        res.redirect(`/furniture`);
    } catch (e) {
        // console.log("fail")
        return res.render("furniture/new", {
            title: "New Furniture",
            authenticated: req.session.user ? true : false,
            user: req.session.user,
            hasErrors: true,
            errors: errors,
            reqInput: req.body,
            partial: "errors-script",
        });
    }
});

// Search for a specific furniture
router.get("/:id", async(req, res) => {
    if (!req.session.user) {
        req.session.previousRoute = req.originalUrl;
        res.redirect("/users/login");
        return;
    }

    var furnitureID = req.params.id.trim();
    var errors = [];
    var allComments = [];

    // get user
    const userName = req.session.user;
    try {
        myUser = await userData.getUserByUserName(userName);
    } catch (e) {
        errors.push("userName or password is not valid.");
    }

    if (!verify.validString(furnitureID)) {
        errors.push("Id of the furniture must be provided");
        return res.render("errors/error", {
            title: "Errors",
            partial: "errors-script",
            errors: errors,
        });
    }

    try {
        const furniture = await furnitureData.getFurnitureById(furnitureID);
        const commentsIdList = furniture.comments_id || [];

        if (commentsIdList.length > 0) {
            allComments = await Promise.all(
                commentsIdList.map(async(x) => {
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

        res.render("furniture/single", {
            partial: "furnitures-single-script",
            title: "Furniture",
            authenticated: req.session.user ? true : false,
            user: userArr, // obj
            furniture: furniture, // obj
            comments: allCommentsProcessed, // arr
            photos: photos,
            //添加经纬度

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