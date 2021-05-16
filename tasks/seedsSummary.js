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

    //Add users
    const u1 = await userData.createUser("abrown", "Anna", "Brown", 23, "anna@gmail.com", "password", "a good people")
    const u2 = await userData.createUser("mpatric", "Mary", "Patricia", 24, "mpatric@gmail.com", "password", "a bad people")
    const u3 = await userData.createUser("jjohn", "Jennifer", "John", 26, "jjohn@gmail.com", "password", "a nice people")
    const u4 = await userData.createUser("mlinda", "Michael", "Linda", 33, "mlinda@gmail.com", "password", "a cool ")
    const u5 = await userData.createUser("dbarbara", "David", "Barbara", 63, "dbarbara@gmail.com", "password", "not a people")
    const u6 = await userData.createUser("jjssica", "Joseph", "Jessica", 35, "jjssica@gmail.com", "password", "strong")
    const u7 = await userData.createUser("tsarah", "Thomas", "Sarah", 43, "tsarah@gmail.com", "password", "a dark people")
    const u8 = await userData.createUser("achis", "Christopher", "Daniel", 13, "achis@gmail.com", "password", "quite young")
    const u9 = await userData.createUser("admin", "ADMIN", "ADMIN", 0, "admin@gmail.com", "123456", "admin")




    //Add furniture
    const F1 = await furnitureData.createFurniture(u1._id, "a Long Chart", "Chair", "125 Clinton Street", "120", "a vintage long wood made chart w/ good condition", "https://images.craigslist.org/00W0W_1GIAs4fBuwNz_0tv0s4_600x450.jpg", [u1._id, u2._id, u3._id, u4._id], [u5._id, u6._id, u7._id, u8._id], 'www.googleshop.com', true, '551223333', 40.732628, -74.037628);
    const F2 = await furnitureData.createFurniture(u2._id, "good", "table", "1225 Jefferson Street", "100", "nice piece", "https://images.craigslist.org/00C0C_a69xOzZhx5z_084084_300x300.jpg", [u1._id, u4._id], [u7._id, u8._id], 'www.amazon.com', true, '201220043', 40.7459498, -74.0512955);
    const F3 = await furnitureData.createFurniture(u2._id, "come and grub this", "table", "1325 Grand Street", "200", "an Herman Miller table in great condition", "https://images.craigslist.org/00C0C_1o33HDC2W06z_0CI0t2_600x450.jpg", [u1._id], [u5._id, u8._id], 'www.mermanmiller.com', false, '37982223333', 40.7445109, -74.0514578);
    const F4 = await furnitureData.createFurniture(u3._id, "take this", "coach", "15 Garden Street", "120", "an old coach, just take it if u need", "https://images.craigslist.org/00F0F_kGMT4PUrAR6z_0CI0t2_300x300.jpg", [u1._id, u2._id, u3._id, u4._id], [u5._id, u6._id, u7._id, u8._id], 'www.ikea.com', false, '9652223333', 40.7450379, -74.0524309);
    const F5 = await furnitureData.createFurniture(u5._id, "goodDeal", "chair", "101 Washinton Street", "170", "office chair stoled from my office", "https://images.craigslist.org/00N0N_l1i57u9BrD4z_07b09G_300x300.jpg", [u2._id, u3._id, u4._id], [u5._id, u6._id, u7._id], 'www.facebook.com', true, '20825623', 40.7417174, -74.0491971);
    const F6 = await furnitureData.createFurniture(u7._id, "dont miss it", "bed", "805 Bloomfield Street", "19", "an wood bed, alittle lossey", "https://images.craigslist.org/00i0i_7S3K15oKGFaz_0hq0nH_300x300.jpg", [u1._id, u3._id, u4._id], [u6._id, u7._id, u8._id], 'www.ebay.com', false, '3534223333', 40.7534212, -74.0299569);
    const F7 = await furnitureData.createFurniture(u8._id, "IKEA Bed", "Bed", "1250 Jackson Street", "20", "No Descritpion", "https://images.craigslist.org/00808_qLfrfIE0iZz_0c6094_300x300.jpg", [u1._id, u2._id, u3._id], [u5._id, u6._id], 'www.apple.com', true, '201226784', 40.7228179, -74.1316417);
    const F8 = await furnitureData.createFurniture(u6._id, "iron shelf", "shelf", "Castle Point One", "128", "Iron shelf, free from screch", "https://images.craigslist.org/00W0W_cAxiMCC0ebE_0CI0t2_300x300.jpg", [u1._id, u2._id, u3._id, u4._id, u2._id, u3._id, u4._id], [u5._id, u6._id], 'www.cregitlist.com', false, '201221314', 40.7477496, -74.0302254);




    console.log("Done seeding database");
    await db.serverConfig.close();
}

main().catch(console.log);