const router = require("express").Router();
const {
	createCustomer,
	getCustomers,
	updateCustomer,
	deleteCustomer,
} = require("./database/dbQueries");
const { Client, LocalAuth } = require("whatsapp-web.js");
// const client = new Client();
const SESSION_FILE_PATH = "../../session.json";
const fs = require("fs");
const qrcode = require("qrcode");
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

router.post("/generateqr", async (req, res) => {
	try {
		const message = req.body.message;
		console.log(message);
		let sessionData,
			client,
			session = false;

		const generateQR = async (qr) => {
			try {
				const dataUrl = await qrcode.toDataURL(qr);
				session = true;
				return dataUrl;
			} catch (err) {
				console.error(err);
				return null;
			}
		};

		client = new Client({
			authStrategy: new LocalAuth({
				session: sessionData,
			}),
		});

		client.once("qr", async (qr) => {
			try {
				const dataUrl = await generateQR(qr);
				return res.json({ code: dataUrl });
			} catch (err) {
				console.error(err);
				return res.status(500).send("Error generating QR code.");
			}
		});

		client.on("ready", async () => {
			const response = await getCustomers();
			for (const item of response) {
				const phone = item.phone;
				await client.sendMessage(`521${phone}@c.us`, `${message}`);
				// console.log("Message sent to", phone);
			}
		});
		await client.initialize();
		if (!session) {
			return res.status(200).json({ message: "success" });
		}
	} catch (error) {
		console.error("Error:", error);
		// res.status(500).send("Error generating QR code");
	}
});

router.post("/login", (req, res) => {
	const user = req.body.username;
	const password = req.body.password;

	return res.status(200).json({ user, token: "1234567890" });
});

module.exports = router;
// const response = await getCustomers();

// const x = response.map((item) => {
// 	return new Promise((resolve, reject) => {
// 		client
// 			.sendMessage(`521${item.phone}@c.us`, message)
// 			.then(() => {
// 				resolve(`Message sent to ${item.phone}`);
// 			})
// 			.catch((error) => {
// 				reject(error);
// 			});
// 	});
// });
// Promise.all(x).then((values) => {
// 	console.log(values);
// });
