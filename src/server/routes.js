const router = require("express").Router();
const login = require("./Login");
const panel = require("./panel");
const verifyUser = require("./verifyUser");
const auth = require("./Auth");

router.use("/login", login);
router.use("/auth", auth, verifyUser);
router.use("/panel", auth, panel);

module.exports = router;
