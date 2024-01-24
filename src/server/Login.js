const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { getUser, updateToken } = require("./database/dbQueries");

const comparePassword = (password, hash) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, hash, (err, result) => {
			if (err) reject(err);
			resolve(result);
		});
	});
};
router.post("/", async (req, res) => {
	try {
		const { username, password } = req.body;

		const userName = await getUser(username);
		console.log(userName);
		const compare = await comparePassword(password, userName[0].password);
		if (!compare) {
			return res.json({
				status: "Usuario o contraseña incorrectos",
				code: 400,
			});
		}
		const TOKEN_KEY = process.env.TOKEN_KEY;
		const access_token = jwt.sign(
			{
				username: userName[0].username,
				idUser: userName[0].id,
			},
			TOKEN_KEY,
			{ expiresIn: "1h" }
		);
		await updateToken([access_token, userName[0].id]);
		return res.status(200).json({
			code: 200,
			user: userName[0].username,
			token: access_token,
		});
	} catch (error) {
		console.log(error);
		return res.json({
			status: "Usuario o contraseña incorrectos",
			code: 400,
		});
	}
});
module.exports = router;
