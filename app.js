const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const session = require("express-session"); // which generate session ID and save on client browser cache
const exphbs = require("express-handlebars");

const handlebarsInstance = exphbs.create({
	defaultLayout: "main",
	// Specify helpers which are only registered on this instance.
	helpers: {
		asJSON: (obj, spacing) => {
			if (typeof spacing === "number") return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

			return new Handlebars.SafeString(JSON.stringify(obj));
		},
		checkListMem: function (elem, target) {
			if (elem && target) {
				return target.includes(elem);
			} else return false;
		},
		checkListLengthZero: function (arr) {
			return arr.length == 0;
		},
	},
	partialsDir: ["views/partials/"],
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", static); // 这个有什么用?? 表明所有用到的client side js?

app.use(
	session({
		name: "this is just a neccessary name. not a params",
		secret: "This is just a neccessary secret.. shhh don't tell anyone. not a params",
		saveUninitialized: true,
		resave: false,
		// cookie: { secure: true, maxAge: 60000 }, // req.session.cookie , this is a params, but can self define objects
	})
);

// if (app.get('env') === 'production') {
// 	app.set('trust proxy', 1) // trust first proxy
// 	sess.cookie.secure = true // serve secure cookies
//   }

// Authentication Middleware
app.use("/private", (req, res, next) => {
	console.log("req.originalUrl: " + req.originalUrl);
	console.log("req.session.user: " + req.session.user);
	if (!req.session.user) {
		return res.status(403).render("errors/error", {
			title: "Errors",
			errors: ["You cannot access the private route without logging in"],
			partial: "errors-script",
		});
	} else {
		next();
	}
});

// Logging Middleware
// 需要做流量统计的函数
// let totalRequests = 0;

// app.use(async (req, res, next) => {
// 	//  这个middle ware  会记录总的request, 所有访问的记录, 都会经过这个middle ware - 这个不是route
// 	// 之后会经过next, 去找另外的 middle ware function in app.js
// 	// 下面的都是middleware function, 而且每一次request, 就可以读取 client side request的对应的内容
// 	// 这个request可以是访问不同的route
// 	totalRequests++;
// 	console.log(`There have been ${totalRequests} requests made to the server`);
// 	next();
// });

// 访问流量 的时间统计 // 这些都可以作为 服务器的log 存起来
app.use(async (req, res, next) => {
	console.log("---------");
	// console.log("req.session.user: " + req.session.user);
	console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${req.session.user ? "Authenticated User" : "Non-Authenticated User"}) `);

	next();
});

// 只能登录后 才能访问的界面 furniture 创建界面的 filter
app.use("/furniture/new", async (req, res, next) => {
	if (!req.session.user) {
		req.session.previousRoute = req.originalUrl; // request will record the originalUrl when it send the request
		return res.status(403).render("users/login", {
			title: "Log In",
			error: ["You must be logged in to create a furniture"],
			partial: "login-script",
		});
	}
	next();
});

// 这个应该就是 rental的 创建界面
app.use("/rental/new", async (req, res, next) => {
	if (!req.session.user) {
		req.session.previousRoute = req.originalUrl;
		return res.status(403).render("users/login", {
			title: "Log In",
			error: ["You must be logged in to create a rental"],
			partial: "login-script",
		});
	}
	next();
});

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

configRoutes(app);



// Constants
const PORT = 3000;
const HOST = 'localhost';
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);


// app.listen(3000, () => {
// 	console.log("We've now got a server!");
// 	console.log("Your routes will be running on http://localhost:3000");
// });

// // Access the session as req.session
// app.get('/', function(req, res, next) {
// 	if (req.session.views) {
//   console.log(req.sessionID) // unique
// 	  req.session.views++
// 	  res.setHeader('Content-Type', 'text/html')
// 	  res.write('<p>views: ' + req.session.views + '</p>')
// 	  res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
// 	  res.end()
// 	} else {
// 	  req.session.views = 1
// 	  res.end('welcome to the session demo. refresh!')
// 	}
//   })
