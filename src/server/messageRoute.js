const router = require("express").Router();
const {
	createCustomer,
	getCustomers,
	updateCustomer,
	deleteCustomer,
} = require("./database/dbQueries");

const sendMessageFunction = require("./message");

router.post("/create", async (req, res) => {
	try {
		const firstname = req.body.firstname;
		const lastname = req.body.lastname;
		const phone = req.body.phone;
		const email = req.body.email;

		const values = [firstname, lastname, phone, email];

		await createCustomer(values);
		res.status(200).json({ message: "success" });
	} catch (error) {
		res.status(500).json({ message: "error" });
	}
});

router.get("/get", async (req, res) => {
	try {
		const response = await getCustomers();
		return res.status(200).json(response);
	} catch (error) {
		return res.status(500).json({ message: "error" });
	}
});

router.post("/update", async (req, res) => {
	try {
		const firstname = req.body.firstname;
		const lastname = req.body.lastname;
		const phone = req.body.phone;
		const email = req.body.email;
		const id = req.body.id;

		const values = [firstname, lastname, phone, email, id];

		await updateCustomer(values);
		return res.status(200).json({ message: "success" });
	} catch (error) {
		return res.status(500).json({ message: "error" });
	}
});

router.post("/delete", async (req, res) => {
	try {
		const id = req.body.id;
		await deleteCustomer(id);
		return res.status(200).json({ message: "success" });
	} catch (error) {
		return res.status(500).json({ message: "error" });
	}
});

router.post("/campain", async (req, res) => {
	try {
		const message = req.body.message;

		const data = sendMessageFunction("523121931090", message);
		console.log(data);
		return res.status(200).json({ message: "success" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "error" });
	}
});

router.post("/login", (req, res) => {
	const user = req.body.username;
	const password = req.body.password;

	return res.status(200).json({ user, token: "1234567890" });
});

module.exports = router;
