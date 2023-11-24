const router = require("express").Router();

router.post("/", (req, res) => {
	const user = req.body.user;
	const password = req.body.password;

	return res.status(200).json({ user, password });
});

module.exports = router;
