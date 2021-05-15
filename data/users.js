const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const furniture = mongoCollections.furniture;
const comments = mongoCollections.comments;
const rental = mongoCollections.rental;

const verifier = require("./verify");
const shareUtilsDB = require("./shareUtilsDB");
const bcrypt = require("bcryptjs");
const saltRounds = 8;
// const uuid = require("uuid");
const { ObjectId } = require("mongodb");

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
		if (!verifier.validString(firstName)) throw "First name is not a valid string.";
		if (!verifier.validString(lastName)) throw "Last name is not a valid string.";
		if (!verifier.validEmail(email)) throw "Email is not a valid string.";
		if (!verifier.validString(userName)) throw "userName is not a valid string.";
		if (!verifier.validAge(age)) throw "Age must be a positive integer";
		if (!verifier.validPassword(password)) throw "Password can only contain [a-z][0-9][A-Z][_-], and length range [6, 16]";
		// if (!verifier.validString(selfSummary)) throw "selfSummary is not a valid string.";

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
			favor_furniture_id: [],
			favor_rental_id: [],
			acessHistory: { furniture_id: [], rental_id: [] },
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
		if (!verifier.validString(id)) throw "User id is not a valid string.";
		const userCollection = await users();
		let user = await userCollection.findOne({ _id: id });
		if (user === null) throw `user not found with id: ${id}`;
		return user;
	},

	async getUserByUserName(userName) {
		if (!verifier.validString(userName)) throw "userName is not a valid string.";
		const userCollection = await users();
		let user = await userCollection.findOne({ userName: userName });
		if (user === null) throw `user not found with userName: ${userName}`;
		return user;
	},

	//////////////////////////////////////////////////////////////////
	// Update
	//////////////////////////////////////////////////////////////////
	// update User email, userName, age, selfSummary
	async updateUserInfo(id, newUserInfo) {
		if (!verifier.validString(id)) throw "User id is not a valid string.";

		let updatedUserData = {};

		if (newUserInfo.firstName) {
			firstName = newUserInfo.firstName;
			if (!verifier.validString(firstName)) throw "First name is not a valid string.";
			updatedUserData.firstName = firstName;
		}

		if (newUserInfo.lastName) {
			lastName = newUserInfo.lastName;
			if (!verifier.validString(lastName)) throw "First name is not a valid string.";
			updatedUserData.lastName = lastName;
		}

		// if (newUserInfo.userName) {
		// 	if (!verifier.validString(newUserInfo.userName)) throw "userName is not a valid string.";
		// 	userName = newUserInfo.userName.toLowerCase();
		// 	if (await this.DuplicateCheck_userName(userName)) throw "This userName is already taken.";
		// 	updatedUserData.userName = userName;
		// }

		// if (newUserInfo.email) {
		// 	if (!verifier.validEmail(newUserInfo.email)) throw "Email is not a valid string.";
		// 	email = newUserInfo.email.toLowerCase();
		// 	if (await this.DuplicateCheck_email(email)) throw "This email is already taken.";
		// 	updatedUserData.email = email;
		// }

		if (newUserInfo.age) {
			age = parseInt(newUserInfo.age);
			if (!verifier.validAge(age)) throw "Age must be a positive integer";
			updatedUserData.age = age;
		}
		if (newUserInfo.selfSummary) {
			// if (!verifier.validString(selfSummary)) throw "selfSummary is not a valid string.";
			updatedUserData.selfSummary = newUserInfo.selfSummary;
		}

		const userCollection = await users();
		await userCollection.updateOne({ _id: id }, { $set: updatedUserData });

		return await this.getUserById(id);
	},

	// updateUserPassword
	async updateUserPassword(id, password) {
		if (!verifier.validString(id)) throw "User id is not a valid string.";
		if (!verifier.validPassword(password)) throw "Password is not a valid string.";
		const userCollection = await users();
		const user = await userCollection.findOne({ _id: id });

		let match = false;
		try {
			match = await bcrypt.compare(password, user.hashed_pw);
		} catch (e) {}

		if (match) throw "Password is not changed";

		// updare hashed password
		const new_hashedPassword = await bcrypt.hash(password, saltRounds);
		if (!verifier.validPassword(password)) throw "Password is not a valid string.";
		const updatedInfo = await userCollection.update({ _id: id }, { $set: { hashed_pw: new_hashedPassword } });
		if (updatedInfo.modifiedCount === 0) throw "Could not update password in User collection successfully.";
		return await this.getUserById(id);
	},

	//////////////////////////////////////////////////////////////////
	// Delete not that neccessary in project
	//////////////////////////////////////////////////////////////////
	async deleteUser(user_id) {
		if (!verifier.validString(user_id)) throw "User id is not a valid string.";
		const user = await this.getUserById(user_id);
		let deleteInfoAll = {};

		if (user.furniture_id.length != 0) {
			const furnitureCollection = await furniture();
			const deletionInfo_furniture = await furnitureCollection.deleteMany({ _id: { $in: Object.values(user.furniture_id) } });
			deleteInfoAll.furniture_deletedCount = deletionInfo_furniture.deletedCount;
		}

		if (user.rental_id.length != 0) {
			const rentalCollection = await rental();
			const deletionInfo_rental = await rentalCollection.deleteMany({ _id: { $in: Object.values(user.rental_id) } });
			deleteInfoAll.rental_deletedCount = deletionInfo_rental.deletedCount;
		}

		// console.log(user.comments_id);
		if (user.comments_id.length != 0) {
			const commentsCollection = await comments();
			const deletionInfo_comment = await commentsCollection.deleteMany({ _id: { $in: Object.values(user.comments_id) } });
			deleteInfoAll.comment_deletedCount = deletionInfo_comment.deletedCount;
		}

		const usersCollection = await users();
		const deletionInfo = await usersCollection.deleteOne({ _id: user_id });
		if (deletionInfo.deletedCount === 0) throw `Could not delete user with id of ${user_id}`;

		return user.userName + " has been successfully deleted. Related deleted records: " + JSON.stringify(deleteInfoAll);
	},
};

module.exports = exportedMethods;
