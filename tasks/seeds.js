const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const userData = data.users;
const furnitureData = data.furniture;
const rentalData = data.rental;
const commentData = data.comments;
const toggleFn = data.toggleFn;

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    /** start of the testing code finish function below*/

    // create a user -> which means we will have userId first

    let userOne = await userData.createUser(
        (userName = "wyang"),
        (firstName = "wei"),
        (lastName = "yang"),
        (age = 100),
        (email = "wyang17@stevens.edu"),
        (password = "111111"),
        (selfSummary = "Wyang summary")
    );

    const userOneId = userOne._id;
    console.log(userOneId);

    userOne = await userData.updateUserInfo((id = userOneId), (newUserInfo = { age: 200, email: "hey.weiyang@gmail.com" }));
    userOne = await userData.updateUserPassword((id = userOneId), (password = "123456"));
    console.log(userOneId);
    const newRental = await rentalData.createRental(
        "location",
        1,
        1,
        2,
        3,
        "description",
        "ddd",
        "d",
        0,
        0,
        "ff",
        1,
        1,
        1,
        userOneId
    );

    console.log(newRental)
    // create furniture
    var furniture1 = await furnitureData.createFurniture(
        userOneId,
        (name = "1"),
        (category = "table"),
        (location = "A"),
        (price = 20),
        (description = "good"),
        (photos = []),
        (like = 23),
        (dislike = 3),
        (purchase_link = "www.link.com"),
        (sold = false),
        (contact = 1500000000),
        (latitude = 40.75017),
        (longtitude = -74.0363)
    );
    const furniture1Id = furniture1._id;
    console.log(furniture1Id);

    var furniture2 = await furnitureData.createFurniture(
        userOneId,
        (name = "2"),
        (category = "chair"),
        (location = "A"),
        (price = 20),
        (description = "good"),
        (photos = []),
        (like = 23),
        (dislike = 3),
        (purchase_link = "www.link.com"),
        (sold = false),
        (contact = 1500000000),
        (latitude = 40.750175738821596),
        (longtitude = -74.03633360907756)
    );
    const furniture2Id = furniture2._id;
    console.log(furniture2Id);

    //Create a New Comment
    var comment = await commentData.addComments(
        user_id = userOneId,
        comment = 'This product is no doubt a garbage, do watch out!',
        report_count = 1,
        helpful_count = 10
    );
    const commentId = comment._id
    console.log(commentId);

    var comment1 = await commentData.addComments(
        user_id = userOneId,
        comment = 'This prodsdfasfsuct is no doubt a garbage, do watch out!',
        report_count = 1,
        helpful_count = 10
    );
    const commentId1 = comment1._id
    console.log(commentId1);

     
    await toggleFn.toggleCommentToFurniture(furniture2Id, commentId) 
    await toggleFn.toggleCommentToFurniture(furniture2Id, commentId1)
    await toggleFn.toggleCommentToUser(userOneId, commentId) 
    await toggleFn.toggleCommentToUser(userOneId, commentId1)

	//移除用户下评论？
    await commentData.deleteComment(commentId1)
	await toggleFn.untoggleCommentToUser(userOneId, commentId1);
    await toggleFn.untoggleCommentToFurniture(furniture2Id, commentId1)



    Comparefurniture2Id = await commentData.getFurnitureByCommentID(commentId)
    // console.log("Comparefurniture2Id     " + Comparefurniture2Id)
    // console.log("furniture2Id     " + furniture2Id)
        // toggle furniture into the userId
        // await toggleFn.toggleFurnitureToUser(userOneId, furniture1Id);
        // await toggleFn.toggleFurnitureToUser(userOneId, furniture2Id);

    // create comments
    // toggle comments into the furniture

    // create rental
    // toggle rental into the userId

    // create comments
    // toggle comments into the rental

    // delete userOne
    // userOne_deleteInfo = await userData.deleteUser(userOneId);
    // console.log(userOne_deleteInfo);
    /** End of the testing code */
    console.log("Done seeding database");
    await db.serverConfig.close();
}

main().catch(console.log);