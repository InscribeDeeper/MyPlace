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

    // create furniture
    var furniture1 = await furnitureData.createFurniture(
        userOneId,
        (category = ["f", "u"]),
        (location = "A"),
        (price = 20),
        (description = "good"),
        (photos = []),
        (like = 23),
        (dislike = 3),
        (purchase_link = "www.link.com"),
        (sold = false),
        (contact = 1500000000)
    );
    const furniture1Id = furniture1._id;
    console.log(furniture1Id);

    var furniture2 = await furnitureData.createFurniture(
        userOneId,
        (category = ["f", "u"]),
        (location = "A"),
        (price = 20),
        (description = "good"),
        (photos = []),
        (like = 23),
        (dislike = 3),
        (purchase_link = "www.link.com"),
        (sold = false),
        (contact = 1500000000)
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