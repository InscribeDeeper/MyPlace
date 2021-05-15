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
	if (!req.session.user) {
		res.redirect("users/login");
	}
});

// 这里的get 的 if 判断, 全部用 middleware解决

// Get login page
router.get("/login", async (req, res) => {
	// if (req.session.user) {
	// 	res.redirect("/private");
	// } else {
	res.render("users/login", {
		title: "Log In",
		authenticated: false,
		partial: "login-script",
		reqInput: req.body
	});
	// }
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
			reqInput: req.body
		});
	}
});

// Post login
router.post("/login", async (req, res) => {
	const userName = xss(req.body.userName.trim());
	const password = xss(req.body.password.trim());
	let myUser = null;

	let errors = [];
	errInfo = ["Invalid userName or password"];

	if (!verifier.validString(userName) || !verifier.validString(password)) {
		// errors.push("Invalid userName or password");
		errors = errInfo;
	}

	try {
		myUser = await userData.getUserByUserName(userName);
	} catch (e) {
		// errors.push("userName or password does not match.");
		errors = errInfo;
	}

	// user exist
	if (errors.length > 0) {
		return res.status(401).render("users/login", {
			title: "Log In",
			partial: "login-script",
			errors: errors,
			reqInput: req.body
		});
	}

	// password compare
	let match = await bcrypt.compare(password, myUser.hashed_pw);
	if (match) {
		req.session.user = myUser.userName; // record into session.user
		let temp = req.session.previousRoute; // bring back to previous page before login
		if (temp) {
			req.session.previousRoute = "";
			res.redirect(temp);
		} else {
			res.redirect("/private");
		}
	} else {
		// errors.push("userName or password does not match");
		errors = errInfo;
		return res.status(401).render("users/login", {
			title: "Log In",
			partial: "login-script",
			errors: errors,
			reqInput: req.body
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
	const age = parseInt(xss(req.body.age));

	// console.log(userName);
	// console.log(typeof userName);
	// console.log(req.body);
	let errors = [];

	if (!verifier.validString(firstName)) errors.push("First name is not a valid string.");
	if (!verifier.validString(lastName)) errors.push("Last name is not a valid string.");
	if (!verifier.validEmail(email)) errors.push("Email is not a valid string.");
	if (!verifier.validString(userName)) errors.push("userName is not a valid string.");
	if (!verifier.validAge(age)) errors.push("Age must be a positive integer");
	if (!verifier.validPassword(password)) errors.push("Password can only contain [a-z][0-9][A-Z][_-], and length range [6, 16]");
	// if (!verifier.validString(selfSummary)) error.push( "selfSummary is not a valid string.");

	if (errors.length > 0) {
		return res.status(401).render("users/signup", {
			authenticated: false,
			title: "Sign Up",
			partial: "signup-script",
			hasErrors: true,
			errors: errors,
			reqInput: req.body
		});
	}

	try {
		const user = await userData.createUser(userName, firstName, lastName, age, email, password, selfSummary);
		req.session.user = user.userName;
		let temp = req.session.previousRoute; // bring back to previous page before login
		if (temp) {
			req.session.previousRoute = "";
			res.redirect(temp);
		} else {
			res.redirect("/");
		}
	} catch (e) {
		errors.push(e);
		return res.status(401).render("users/signup", {
			authenticated: false,
			title: "Sign Up",
			partial: "signup-script",
			hasErrors: true,
			errors: errors,
			reqInput: req.body
		});
	}
});

router.get("/logout", async (req, res) => {
	req.session.destroy();
	res.redirect("/");
});
module.exports = router;
