// 这个是中间件, 用来 next redirect 地址的. 单独写在route的folder下面

// GET 请求主页
router.get("/", (req, res) => {
	res.redirect("/catalog");
});
