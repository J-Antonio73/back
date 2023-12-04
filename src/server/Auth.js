//Create a middleware to check if the user is authenticated using JWT const jwt = require('jsonwebtoken');

const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];
	if (token == "/login") {
		next();
		return res.status(200).json({ message: "login" });
	}
	// Check if the token exists
	if (!token) {
		return res.status(200).json({ message: "No token provided" });
	}

	try {
		// Verify the token
		const decoded = jwt.verify(token, process.env.TOKEN_KEY);

		// Call the next middleware
		next();
		// return res.status(200).json({ message: "success" });
	} catch (error) {
		console.log(error);
		return res.status(200).json({ message: "Invalid token", code: 401 });
	}
};

module.exports = authenticateUser;
