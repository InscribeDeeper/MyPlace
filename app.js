const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const session = require("express-session"); // which generate session ID and save on client browser cache
const exphbs = require("express-handlebars");
// const cookieParser = require("cookie-parser");
// app.use(cookieParser()); // which will generate req.cookies

const handlebarsInstance = exphbs.create({
	defaultLayout: "main", // Specify helpers which are only registered on this instance.
	helpers: {
		asJSON: (obj, spacing) => {
			if (typeof spacing === "number") return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
			return new Handlebars.SafeString(JSON.stringify(obj));
		},
	},
	// helpers: {
	// 	asJSON: (obj, spacing) => {
	// 		if (typeof spacing === "number") return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

	// 		return new Handlebars.SafeString(JSON.stringify(obj));
	// 	},
	// 	checkListMem: function (elem, target) {
	// 		if (elem && target) {
	// 			return target.includes(elem);
	// 		} else return false;
	// 	},
	// 	checkListLengthZero: function (arr) {
	// 		return arr.length == 0;
	// 	},
	// },
	// partialsDir: ["views/partials/"],
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", static); // 这个有什么用?? 表明所有用到的client side js?
app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

app.use(
	session({
		name: "AuthCookie",
		secret: "This is a secret.. shhh don't tell anyone",
		saveUninitialized: true,
		resave: false,
	}) // 这个session 会在浏览器关掉后就没了
);

// Authentication Middleware
app.use("/private", (req, res, next) => {
	if (!req.session.user) {
		let errors = [];
		errors.push("You cannot access the private route without logging in");
		return res.render("errors/error", {
			title: "Errors",
			errors: errors,
			partial: "errors-script",
		});
	}
	next();

	// if (!req.session.AuthCookie) {
	// 	res.status(403).render("logSys/login", { error: "403: Forbidden Please Log in" });
	// } else {
	// 	next();
	// }
});

// Logging Middleware 
// 需要做流量统计的函数



// 只能登录后 才能访问的界面
// furniture 创建界面的 filter
app.use("/furniture/new", async (req, res, next) => {
	if (!req.session.user) {
		req.session.previousRoute = req.originalUrl;
		return res.render("users/login", {
			title: "Log In",
			error: "You must be logged in to create a furniture",
			partial: "login-script",
		});
	}
	next();
});

// 这个应该就是 rental的 创建界面
app.use("/rental/new", async (req, res, next) => {
	if (!req.session.user) {
		req.session.previousRoute = req.originalUrl;
		return res.render("users/login", {
			title: "Log In",
			error: "You must be logged in to create a rental",
			partial: "login-script",
		});
	}
	next();
});

configRoutes(app);

app.listen(3005, () => {
	console.log("We've now got a server!");
	console.log("Your routes will be running on http://localhost:3005");
});
