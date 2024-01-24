const router = require("express").Router();
const qrcode = require("qrcode");

const fs = require("fs");

const {
	createCustomer,
	getCustomers,
	updateCustomer,
	deleteCustomer,
} = require("./database/dbQueries");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

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
		const image = req.body.image;

		let client,
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
			authStrategy: new LocalAuth(),
			puppeteer: {
				headless: true,
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-dev-shm-usage",
					"--disable-accelerated-2d-canvas",
					"--no-first-run",
					"--no-zygote",
					"--single-process", // <- this one doesn't works in Windows
					"--disable-gpu",
				],
			},
		});

		client.once("qr", async (qr) => {
			try {
				// console.log("QR RECEIVED");
				const dataUrl = await generateQR(qr);
				// console.log("QR RECEIVED");
				return res.json({ code: dataUrl });
			} catch (err) {
				// console.error(err);
				return res.status(500).send("Error generating QR code.");
			}
		});

		console.log("Esta madre ya esta jalandoooooooo!");

		client.on("ready", async () => {
			const response = await getCustomers();
			for (const item of response) {
				const phone = item.phone;

				if (image) {
					const imageFormats = {
						"data:image/jpeg;base64,": "jpeg",
						"data:image/jpg;base64,": "jpeg",
						"data:image/png;base64,": "png",
						"data:image/gif;base64,": "gif",
					};

					let imageFormat = null;
					let imageData = null;

					for (const format in imageFormats) {
						if (image.startsWith(format)) {
							imageFormat = imageFormats[format];
							imageData = image.replace(format, "");
							break;
						}
					}

					if (imageFormat && imageData) {
						const media = new MessageMedia(
							`image/${imageFormat}`,
							imageData
						);
						await client.sendMessage(`521${phone}@c.us`, media);
					}
				}

				await client.sendMessage(`521${phone}@c.us`, `${message}`);
			}
			setTimeout(() => {
				client.destroy();
			}, 5000);
			if (!session) {
				return res.status(200).json({ code: "msgsend" });
			}
		});

		client.initialize();
	} catch (error) {
		console.error("Error:", error);
		res.status(500).send("Error generating QR code");
	}
});

module.exports = router;
