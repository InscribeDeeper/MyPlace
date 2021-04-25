//To 杨威：

//在你这里面记得加一个addRentalToUser和removeRentalToUser的函数
//我发现我们这个project还是得用sub-document比较好可能？
//我的rental.js导进你的函数叫：
//users.addRentalToUser(userId, newId, user, location, price, bedroom, bathroom, space, description, photos, utility, like, dislike, labels, contact)
//和 users.removeRentalToUser
//主要是因为如果要用relationalDB还是啥的话...我不会！！

//from wyx

// ++ update the selfSummary field
// Example User JSON
// User = {
//     "_id": "user_collection_id_1",
//     "first_name": "first",
//     "last_name": "last",
//     "user_name": "myname",
//     "age": 12,
//     "email": "xxx@stevens.edu",
//     "hashed_pw": "jfldjaf24kjdslk12414afjlsaj",
//     "comments_id": ["comment_collection_id_1", "comment_collection_id_12"],
//     "furniture_id": ["furniture_id1", "furniture_id2"],
//     "rental_id": ["rental_id1", "rental_id2"],
//   "selfSummary":""
// }

// 不可以引用其他的DB js, 尽管有在调用的时候, 一个文件管一个collections的理念
// 但是可以在 管这个collections的里面, 调用其他的collections
// 像 SQL一样, 自己关联其他的表格更新.
// 因为会导致循环引用, 所以需要copy对应的函数到这里来就行
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const verify = require("./verify");
const shareUtilsDB = require("./shareUtilsDB");
const bcrypt = require("bcryptjs");
const saltRounds = 8;
// const uuid = require("uuid");
const { ObjectId } = require('mongodb');

let exportedMethods = {
	//////////////////////////////////////////////////////////////////
	// utils
	//////////////////////////////////////////////////////////////////
	async DuplicateCheck_userName(userName) {
		userName = userName.toLowerCase();
		const allUsers = await this.getAllUser();
		if (allUsers.filter((x) => x.userName == userName).length != 0) {
			return true;
			// throw "This userName is already taken.";
		} else {
			return false;
		}
	},

	async DuplicateCheck_email(email) {
		email = email.toLowerCase();
		const allUsers = await this.getAllUser();
		if (allUsers.filter((x) => x.email == email).length != 0) {
			return true;
			// throw "This email is already taken.";
		} else {
			return false;
		}
	},

	//////////////////////////////////////////////////////////////////
	// Add
	//////////////////////////////////////////////////////////////////
	async createUser(userName, firstName, lastName, age, email, password, selfSummary) {
		if (!verify.validString(firstName)) throw "First name is not a valid string.";
		if (!verify.validString(lastName)) throw "Last name is not a valid string.";
		if (!verify.validEmail(email)) throw "Email is not a valid string.";
		if (!verify.validString(userName)) throw "userName is not a valid string.";
		if (!verify.validAge(age)) throw "Age must be a positive integer";
		if (!verify.validPassword(password)) throw "Password can only contain [a-z][0-9][A-Z][_-], and length range [6, 16]";
		// if (!verify.validString(selfSummary)) throw "selfSummary is not a valid string.";

		// duplicate checking
		userName = userName.toLowerCase();
		email = email.toLowerCase();
		if (await this.DuplicateCheck_userName(userName)) throw "This userName is already taken.";
		if (await this.DuplicateCheck_email(email)) throw "This email is already taken.";

		//create hashed password
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		/* Add new user to DB */
		let newObjId = ObjectId(); //creates a new object ID
		let newUser = {
			_id: newObjId.toString(),
			firstName: firstName,
			lastName: lastName,
			email: email,
			userName: userName,
			age: age,
			hashed_pw: hashedPassword,
			selfSummary: selfSummary | "want to know more about me?",
			comments_id: [],
			furniture_id: [],
			rental_id: [],
		};

		const usersCollection = await users();
		const insertInfo = await usersCollection.insertOne(newUser);
		if (insertInfo.insertedCount === 0) throw "User insert failed!";
		const userInDB = await this.getUserById(insertInfo.insertedId);
		return userInDB;
	},

	//////////////////////////////////////////////////////////////////
	// Read
	//////////////////////////////////////////////////////////////////
	async getAllUser() {
		const usersCollection = await users();
		const usersList = await usersCollection.find({}, { projection: { hashed_pw: 0 } }).toArray(); // not show pw
		return usersList;
	},

	async getUserById(id) {
		if (!verify.validString(id)) throw "User id is not a valid string.";
		const userCollection = await users();
		let user = await userCollection.findOne({ _id: id });
		if (user === null) throw `user not found with id: ${id}`;
		return user;
	},

	//////////////////////////////////////////////////////////////////
	// Update
	//////////////////////////////////////////////////////////////////
	// update User email, userName, age, selfSummary
	async updateUserInfo(id, newUserInfo) {
		if (!verify.validString(id)) throw "User id is not a valid string.";

		let updatedUserData = {};

		if (newUserInfo.userName) {
			if (!verify.validString(newUserInfo.userName)) throw "userName is not a valid string.";
			userName = newUserInfo.userName.toLowerCase();
			if (await this.DuplicateCheck_userName(userName)) throw "This userName is already taken.";
			updatedUserData.userName = userName;
		}

		if (newUserInfo.email) {
			if (!verify.validEmail(newUserInfo.email)) throw "Email is not a valid string.";
			email = newUserInfo.email.toLowerCase();
			if (await this.DuplicateCheck_email(email)) throw "This email is already taken.";
			updatedUserData.email = email;
		}
		if (newUserInfo.age) {
			if (!verify.validAge(age)) throw "Age must be a positive integer";
			updatedUserData.age = age;
		}
		if (newUserInfo.selfSummary) {
			// if (!verify.validString(selfSummary)) throw "selfSummary is not a valid string.";
			updatedUserData.selfSummary = newUserInfo.selfSummary;
		}

		const userCollection = await users();
		await userCollection.updateOne({ _id: id }, { $set: updatedUserData });

		return await this.getUserById(id);
	},

	// updateUserPassword
	async updateUserPassword(id, password) {
		if (!verify.validString(id)) throw "User id is not a valid string.";
		if (!verify.validPassword(password)) throw "Password is not a valid string.";
		const userCollection = await users();
		old_hashPassword = userCollection.findOne({ _id: id }, { projection: { hashed_pw: 1 } });

		let match = false;
		try {
			match = await bcrypt.compare(password, old_hashPassword); // 从data 里面来
		} catch (e) {}
		if (match) throw "Password is not changed";

		// updare hashed password
		const new_hashedPassword = await bcrypt.hash(password, saltRounds);
		if (!verify.validPassword(password)) throw "Password is not a valid string.";
		const updatedInfo = await userCollection.updateOne({ _id: id }, { hashed_pw: new_hashedPassword });
		if (updatedInfo.modifiedCount === 0) throw "Could not update password in User collection successfully.";
		return await this.getUserById(id);
	},

	//////////////////////////////////////////////////////////////////
	// Delete not that neccessary in project
	//////////////////////////////////////////////////////////////////
	async deleteUser(user_id) {
		if (!verify.validString(user_id)) throw "User id is not a valid string.";
		const user = await this.getUserById(user_id);
		let deleteInfoAll = {};

		const furnitureCollection = await furniture();
		const deletionInfo_furniture = await furnitureCollection.deleteMany({ _id: { $nin: user.furniture_id } });
		deleteInfoAll.furniture_deletedCount = deletionInfo_furniture.deletedCount;

		const rentalCollection = await rental();
		const deletionInfo_rental = await rentalCollection.deleteMany({ _id: { $nin: user.rental_id } });
		deleteInfoAll.rental_deletedCount = deletionInfo_rental.deletedCount;

		const commentsCollection = await comments();
		const deletionInfo_comment = await commentsCollection.deleteMany({ _id: { $nin: user.comment_id } });
		deleteInfoAll.comment_deletedCount = deletionInfo_comment.deletedCount;

		const usersCollection = await users();
		const deletionInfo = await usersCollection.deleteOne({ _id: user_id });
		if (deletionInfo.deletedCount === 0) throw `Could not delete user with id of ${user_id}`;

		return user + " has been successfully deleted. Related deleted records: " + JSON.stringify(deleteInfoAll);
	},
};

module.exports = exportedMethods;
