// const furnitureRoutes = require('./furniture_copy');
const furnitureRoutes = require("./furniture");
const rentalRoutes = require("./rental");
const commentRoutes = require("./comments");
const userRoutes = require("./users");
const privateRoutes = require("./private");
const apiRoutes = require("./api");
// const statisticsRoutes = require('./statistics');

const constructorMethod = (app) => {
	// Landing page '/' route
	app.get("/", (req, res) => {
		return res.render("landing/landing", {
			authenticated: req.session.user ? true : false,
			user: req.session.user,
			partial: "landing-script",
			title: "Home",
		});
	});
	app.use("/api", apiRoutes);
	app.use("/private", privateRoutes);
	app.use("/comments", commentRoutes);
	// app.use('/statistics', statisticsRoutes);
	app.use("/furniture", furnitureRoutes);
	app.use("/rental", rentalRoutes);
	app.use("/users", userRoutes);

	app.use("*", (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;
