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
    const u9 = await userData.createUser("abrown", "Anna", "Brown", 23, "anna@gmail.com", "password", "a good people")
    const u2 = await userData.createUser("mpatric", "Mary", "Patricia", 24, "mpatric@gmail.com", "password", "a bad people")
    const u3 = await userData.createUser("jjohn", "Jennifer", "John", 26, "jjohn@gmail.com", "password", "a nice people")
    const u4 = await userData.createUser("mlinda", "Michael", "Linda", 33, "mlinda@gmail.com", "password", "a cool ")
    const u5 = await userData.createUser("dbarbara", "David", "Barbara", 63, "dbarbara@gmail.com", "password", "not a people")
    const u6 = await userData.createUser("jjssica", "Joseph", "Jessica", 35, "jjssica@gmail.com", "password", "strong")
    const u7 = await userData.createUser("tsarah", "Thomas", "Sarah", 43, "tsarah@gmail.com", "password", "a dark people")
    const u8 = await userData.createUser("achis", "Christopher", "Daniel", 13, "achis@gmail.com", "password", "quite young")
    const u1 = await userData.createUser("admin", "ADMIN", "ADMIN", 1, "admin@gmail.com", "123456", "admin")




    //Add furniture
    const F1 = await furnitureData.createFurniture(u1._id, "a Long Chart", "Chair", "125 Clinton Street", "120", "a vintage long wood made chart w/ good condition", "https://images.craigslist.org/00W0W_1GIAs4fBuwNz_0tv0s4_600x450.jpg", [u1._id, u2._id, u3._id, u4._id], [u5._id, u6._id, u7._id, u8._id], 'www.googleshop.com', true, '551223333', 40.732628, -74.037628);
    const F2 = await furnitureData.createFurniture(u2._id, "good", "table", "1225 Jefferson Street", "100", "nice piece", "https://images.craigslist.org/00C0C_a69xOzZhx5z_084084_300x300.jpg", [u1._id, u4._id], [u7._id, u8._id], 'www.amazon.com', true, '201220043', 40.7459498, -74.0512955);
    const F3 = await furnitureData.createFurniture(u2._id, "come and grub this", "table", "1325 Grand Street", "200", "an Herman Miller table in great condition", "https://images.craigslist.org/00C0C_1o33HDC2W06z_0CI0t2_600x450.jpg", [u1._id], [u5._id, u8._id], 'www.mermanmiller.com', false, '37982223333', 40.7445109, -74.0514578);
    const F4 = await furnitureData.createFurniture(u3._id, "take this", "coach", "15 Garden Street", "120", "an old coach, just take it if u need", "https://images.craigslist.org/00F0F_kGMT4PUrAR6z_0CI0t2_300x300.jpg", [u1._id, u2._id, u3._id, u4._id], [u5._id, u6._id, u7._id, u8._id], 'www.ikea.com', false, '9652223333', 40.7450379, -74.0524309);
    const F5 = await furnitureData.createFurniture(u5._id, "goodDeal", "chair", "101 Washinton Street", "170", "office chair stoled from my office", "https://images.craigslist.org/00N0N_l1i57u9BrD4z_07b09G_300x300.jpg", [u2._id, u3._id, u4._id], [u5._id, u6._id, u7._id], 'www.facebook.com', true, '20825623', 40.7417174, -74.0491971);
    const F6 = await furnitureData.createFurniture(u7._id, "dont miss it", "bed", "805 Bloomfield Street", "19", "an wood bed, alittle lossey", "https://images.craigslist.org/00i0i_7S3K15oKGFaz_0hq0nH_300x300.jpg", [u1._id, u3._id, u4._id], [u6._id, u7._id, u8._id], 'www.ebay.com', false, '3534223333', 40.7534212, -74.0299569);
    const F7 = await furnitureData.createFurniture(u8._id, "IKEA Bed", "Bed", "1250 Jackson Street", "20", "No Descritpion", "https://images.craigslist.org/00808_qLfrfIE0iZz_0c6094_300x300.jpg", [u1._id, u2._id, u3._id], [u5._id, u6._id], 'www.apple.com', true, '201226784', 40.7228179, -74.1316417);
    const F8 = await furnitureData.createFurniture(u6._id, "iron shelf", "shelf", "Castle Point One", "128", "Iron shelf, free from screch", "https://images.craigslist.org/00W0W_cAxiMCC0ebE_0CI0t2_300x300.jpg", [u1._id, u2._id, u3._id, u4._id, u2._id, u3._id, u4._id], [u5._id, u6._id], 'www.cregitlist.com', false, '201221314', 40.7477496, -74.0302254);

    //Add rental
    const R1 = await rentalData.createRental("125 Clinton Street", 2000, 2, 2, 1200, "Small Condo ease to commute", "https://images.craigslist.org/00202_gi2F8Gb4ZgGz_0hq0bC_600x450.jpg", "Wash Machine, Baker, Heater, Top Light", [u1._id, u2._id, u3._id, u4._id], [u5._id, u6._id, u7._id, u8._id], "quiet", "5513432359", 40.7459498, -74.0512955, u2._id)
    const R2 = await rentalData.createRental("544 Best Street", 3000, 4, 2, 2000, "Best community in here, come!", "https://images.craigslist.org/00808_2SpkWHsP9Vdz_0t20CI_600x450.jpg", "Wash Machine, Baker, Heater, Top Light, golf filed", [u1._id, u2._id, u3._id, u4._id], [u5._id, u6._id, u7._id, u8._id], "quiet", "21313432449", -40.7459498, -44.0512955, u1._id)
    const R3 = await rentalData.createRental("123 queen rd, asfdville", 300, 1, 3, 790, "good air, good house, good people", "https://images.craigslist.org/00h0h_idSupq9G1eez_0gw0co_600x450.jpg", "field, Baker, Heater, Top Light", [u1._id, u5._id, u2._id, u3._id, u4._id], [u1._id, u5._id, u6._id, u7._id, u8._id], "good, peaceful, safe", "19929394944", 40.7445109, -74.0514578, u1._id)
    const R4 = await rentalData.createRental("2344 king, haredsbery", 4999, 5, 6, 50000, "Wonderful place to let people who wants high quality life", "https://images.craigslist.org/00808_fjs0EAmcEpxz_0dm0d5_600x450.jpg", "horsefield, golf field, Baker, Heater, Top Light", [u1._id, u5._id, u2._id, u3._id, u4._id, u6._id, u7._id], [u8._id], "Luxury, Animate, Wonderful", "1111211111", 40.7417174, -74.0491971, u9._id)
    const R5 = await rentalData.createRental("5433 fox, animalliville", 2999, 4, 3, 7900, "Dream place to live", " https://images.craigslist.org/00P0P_d1o3JtEZkrJz_0dm0bc_600x450.jpg", "heat, washing machine, Top Light", [u1._id, u5._id, u2._id, u3._id, u4._id], [u6._id, u7._id, u8._id], "annimate, peaceful", "43929394944", 40.7450379, -74.0524309, u7._id)
    const R6 = await rentalData.createRental("1225 Adem Street", 3500, 2, 2, 1100, "Fine apt close to the 126 Station", "https://images.craigslist.org/00808_2SpkWHsP9Vdz_0t20CI_600x450.jpg", "Wash Machine, Baker, Heater, Top Light", [u5._id, u7._id], [u5._id], "pet friendly", "551356859", 40.732628, -74.037628, u4._id)
    const R7 = await rentalData.createRental("1125 Jefferson Street", 2800, 2, 1, 1050, "Nice condo next to the Path", "https://images.craigslist.org/00h0h_idSupq9G1eez_0gw0co_600x450.jpg", " Baker, Heater, AC", [u1._id, u3._id, u4._id], [u5._id, u6._id, u7._id, u8._id], "good view", "5515572359", 40.7534212, -74.0299569, u9._id)
    const R8 = await rentalData.createRental("255 Willow Ave", 4000, 3, 2, 1600, "Hudson riverside View!", "https://images.craigslist.org/00808_fjs0EAmcEpxz_0dm0d5_600x450.jpg", "Heater, Top Light", [u1._id, u2._id], [], "easy to commute", "5513432234", 40.7228179, -74.1316417, u7._id)
    const R9 = await rentalData.createRental("1500 Washintwon Street", 2900, 1, 1, 800, "view of empire midtown", "https://images.craigslist.org/00P0P_d1o3JtEZkrJz_0dm0bc_600x450.jpg", "Wash Machine, Baker, Heater, Top Light", [u5._id, u4._id], [u7._id, u8._id], "nice neighbor", "2013432359", 40.7477496, -74.0302254, u5._id)


    //Add Comments
    const C1 = await commentData.addComments(u1._id, "this deal is actually good,comment to mark")
    const C2 = await commentData.addComments(u2._id, "beatiful price!")
    const C3 = await commentData.addComments(u3._id, "It looks good but the price is emmmm")
    const C4 = await commentData.addComments(u4._id, "The owner is one of the most decent person I've every met")
    const C7 = await commentData.addComments(u5._id, "comment to mark")
    const C5 = await commentData.addComments(u6._id, "Spam information, again!")
    const C8 = await commentData.addComments(u7._id, "ROCK!")
    const C6 = await commentData.addComments(u8._id, "You know what, I'll take this deal! Where is the contact, oh I see")
    const C9 = await commentData.addComments(u2._id, "I like it, but i dont have money, hold longer see if i can have it")
    const C10 = await commentData.addComments(u1._id, "It seems good, I like it very much.")
    const C11 = await commentData.addComments(u1._id, "who want to learn how to make money, go to www.trickyoupayplace.com to learn how to make money")
    const C12 = await commentData.addComments(u1._id, "I know this. why are you selling this? take it down")

    await toggleFn.toggleCommentToFurniture(F1._id, C1._id)
    await toggleFn.toggleCommentToFurniture(F2._id, C2._id)
    await toggleFn.toggleCommentToFurniture(F3._id, C3._id)
    await toggleFn.toggleCommentToFurniture(F4._id, C4._id)
    await toggleFn.toggleCommentToFurniture(F5._id, C4._id)
    await toggleFn.toggleCommentToFurniture(F6._id, C6._id)
    await toggleFn.toggleCommentToFurniture(F7._id, C7._id)
    await toggleFn.toggleCommentToFurniture(F8._id, C8._id)


    await toggleFn.toggleCommentToUser(u1._id, C1._id) //
    await toggleFn.toggleCommentToUser(u2._id, C2._id) //
    await toggleFn.toggleCommentToUser(u3._id, C3._id) //
    await toggleFn.toggleCommentToUser(u4._id, C4._id) //
    await toggleFn.toggleCommentToUser(u5._id, C7._id) //
    await toggleFn.toggleCommentToUser(u6._id, C5._id) //
    await toggleFn.toggleCommentToUser(u7._id, C8._id) //
    await toggleFn.toggleCommentToUser(u8._id, C6._id)
    await toggleFn.toggleCommentToUser(u2._id, C9._id)
    await toggleFn.toggleCommentToUser(u1._id, C11._id)
    await toggleFn.toggleCommentToUser(u1._id, C10._id)
    await toggleFn.toggleCommentToUser(u1._id, C12._id)




    await toggleFn.toggleCommentToRental(R1._id,  C1._id)
    await toggleFn.toggleCommentToRental(R2._id,  C2._id)
    await toggleFn.toggleCommentToRental(R3._id,  C3._id)
    await toggleFn.toggleCommentToRental(R1._id,  C2._id)
    await toggleFn.toggleCommentToRental(R2._id,  C3._id)
    await toggleFn.toggleCommentToRental(R3._id,  C1._id)
    await toggleFn.toggleCommentToRental(R1._id,  C3._id)
    await toggleFn.toggleCommentToRental(R2._id,  C5._id)
    await toggleFn.toggleCommentToRental(R3._id,  C6._id)
    await toggleFn.toggleCommentToRental(R4._id,  C7._id)
    await toggleFn.toggleCommentToRental(R5._id,  C9._id)
    await toggleFn.toggleCommentToRental(R6._id,  C10._id)
    await toggleFn.toggleCommentToRental(R7._id,  C11._id)
    await toggleFn.toggleCommentToRental(R8._id,  C12._id)
    await toggleFn.toggleCommentToRental(R9._id,  C4._id)


    // toggleFn.toggleCommentToFurniture(furniture_id,  comment_id)
    // toggleFn.toggleCommentToRental(rental_id,  comment_id)
    // toggleFn.toggleCommentToUser(user_id, comment_id)


    console.log("Done seeding database");
    await db.serverConfig.close();
}

main().catch(console.log);