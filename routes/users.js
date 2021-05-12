const express = require("express");
const router = express.Router();
const data = require("../data");
const bcrypt = require("bcrypt");
const verifier = require("../data/verify");
const xss = require("xss");
const userData = data.users;

// Redirect if user is logged in and authenticated
/*
    Why don't we use middleware for this?
*/
router.get("/", async (req, res) => {
	if (req.session.user) {
		res.redirect("/landing/landing");
	}
});

// Get login page
router.get("/login", async (req, res) => {
	if (req.session.user) {
		res.redirect("/private");
	} else {
		res.render("users/login", {
			title: "Log In",
			authenticated: false,
			partial: "login-script",
		});
	}
});

// Get signup page
router.get("/signup", async (req, res) => {
	if (req.session.user) {
		res.redirect("/private");
	} else {
		res.render("users/signup", {
			title: "Sign Up",
			authenticated: false,
			partial: "signup-script",
		});
	}
});

// Post login
router.post("/login", async (req, res) => {
	const userName = xss(req.body.userName.trim());
	const password = xss(req.body.password.trim());
	let myUser;

	let errors = [];

	if (!verifier.validString(userName) || !verifier.validString(password)) errors.push("Invalid userName or password");

	/*
        Why not create a function in users to query by userName since each userName should be unique?
    */
	const users = await userData.getAllUsers();
	for (let i = 0; i < users.length; i++) {
		if (users[i].userName == userName) {
			myUser = users[i];
		}
	}

	if (!myUser) errors.push("userName or password does not match.");

	if (errors.length > 0) {
		return res.status(401).render("users/login", {
			title: "Log In",
			partial: "login-script",
			errors: errors,
		});
	}

	let match = await bcrypt.compare(password, myUser.hashedPassword);

	if (match) {
		req.session.user = myUser;
		// Redirect the user to their previous route after they login if it exists
		// Otherwise, bring them to the restaurants list page
		let temp = req.session.previousRoute;
		if (temp) {
			req.session.previousRoute = "";
			return res.redirect(temp);
		}
		res.redirect("/");
	} else {
		errors.push("userName or password does not match");
		return res.status(401).render("users/login", {
			title: "Errors",
			partial: "login-script",
			errors: errors,
		});
	}
});

router.post("/signup", async (req, res) => {
	const firstName = xss(req.body.firstName);
	const lastName = xss(req.body.lastName);
	const userName = xss(req.body.userName);
	const password = xss(req.body.password);
	const email = xss(req.body.email);
	const selfSummary = xss(req.body.selfSummary);
	let age = parseInt(xss(req.body.age));

	errors = [];
	if (!verifier.validString(firstName)) throw "First name is not a valid string.";
	if (!verifier.validString(lastName)) throw "Last name is not a valid string.";
	if (!verifier.validEmail(email)) throw "Email is not a valid string.";
	if (!verifier.validString(userName)) throw "userName is not a valid string.";
	if (!verifier.validAge(age)) throw "Age must be a positive integer";
	if (!verifier.validPassword(password)) throw "Password can only contain [a-z][0-9][A-Z][_-], and length range [6, 16]";
	// if (!verifier.validString(selfSummary)) throw "selfSummary is not a valid string.";

	if (errors.length > 0) {
		return res.status(401).render("users/signup", {
			authenticated: false,
			title: "Sign Up",
			partial: "signup-script",
			errors: errors,
		});
	}

	try {
		const user = await userData.createUser(userName, firstName, lastName, age, email, password, selfSummary);
		req.session.user = user;
		res.redirect("/"); // to landing
	} catch (e) {
		errors.push(e);
		return res.status(401).render("users/signup", {
			authenticated: false,
			title: "Sign Up",
			partial: "signup-script",
			errors: errors,
		});
	}
});

router.get("/logout", async (req, res) => {
	req.session.destroy();
	res.redirect("/");
});
module.exports = router;
