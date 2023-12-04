const router = require("express").Router();

router.post("/", async (req, res) => {
	return res.json({ code: 200, message: "success" });
});

module.exports = router;
