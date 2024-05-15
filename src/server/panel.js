const router = require("express").Router();
const qrcode = require("qrcode");

const fs = require("fs");
const { join, extname } = require("path");

const path = require("path");
const sessionDirectory = path.join(__dirname, "session");
const multer = require("multer");
const xlsx = require("xlsx");

// Verificar si el directorio existe
if (!fs.existsSync(sessionDirectory)) {
	// Crear el directorio si no existe
	fs.mkdirSync(sessionDirectory);
}
const {
	createCustomer,
	getCustomers,
	updateCustomer,
	deleteCustomer,
	getDistritos,
} = require("./database/dbQueries");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

const CURRENT_DIR = __dirname;
// const MIMETYPES = ["image/png", "image/jpg", "image/jpeg"];
const multerProducts = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, join(CURRENT_DIR, "./excelFile"));
		},
		filename: (req, file, cb) => {
			const ext = extname(file.originalname);
			const fileName = file.originalname.split(ext)[0];
			cb(null, `${fileName}-${Date.now()}${ext}`);
		},
	}),
	limits: { fileSize: 10000000 },
});

router.post("/create", multerProducts.single("file"), async (req, res) => {
	try {
		if (req.file) {
			const filePath = req.file.path;

			const workbook = xlsx.readFile(filePath);
			const sheetName = workbook.SheetNames[0]; // Suponemos que estamos leyendo la primera hoja
			const worksheet = workbook.Sheets[sheetName];

			const jsonData = xlsx.utils.sheet_to_json(worksheet);
			jsonData.forEach(async (item) => {
				const firstname = item.nombre ? item.nombre : "";
				const lastname = item.apellidos ? item.apellidos : "";
				const phone = item.telefono ? item.telefono : "";
				const email = item.correo ? item.correo : "";
				const group = item.grupo ? item.grupo : "0";
				await createCustomer([
					firstname,
					lastname,
					phone,
					email,
					group,
				]);
			});
			fs.unlinkSync(filePath);
		} else {
			const data = JSON.parse(req.body.data);
			const firstname = data.firstname;
			const lastname = data.lastname;
			const phone = data.phone;
			const email = data.email;
			await createCustomer([firstname, lastname, phone, email]);
		}
		res.status(200).json({ message: "success" });
	} catch (error) {
		console.log(error);
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

router.get("/getdis", async (req, res) => {
	try {
		const response = await getDistritos();
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
		const dist = req.body.dist;
		const id = req.body.id;

		const values = [firstname, lastname, phone, email, dist, id];

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
		const dist = req.body.dist;

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
			webVersion: "2.2409.2",
			webVersionCache: {
				type: "remote",
				remotePath:
					"https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html",
			},
			// authStrategy: new LocalAuth(),
			puppeteer: {
				headless: true,
				args: ["--no-sandbox", "--disable-setuid-sandbox"],
				executablePath: "/app/.apt/usr/bin/google-chrome",
				// executablePath:
				// 	"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
			},
		});

		client.once("qr", async (qr) => {
			try {
				// console.log("QR RECEIVED");
				const dataUrl = await generateQR(qr);
				console.log("QR RECEIVED");
				return res.json({ code: dataUrl });
			} catch (err) {
				console.error(err);
				if (!res.headersSent)
					return res.status(500).send("Error generating QR code.");
			}
		});

		console.log("Esta madre ya esta jalandoooooooo!");

		client.on("ready", async () => {
			console.log("Client is ready!");
			const response = await getCustomers(dist);
			let media = null;
			if (image) {
				const imageFormats = {
					"data:image/jpeg;base64,": "jpeg",
					"data:image/jpg;base64,": "jpeg",
					"data:image/png;base64,": "png",
					"data:image/gif;base64,": "gif",
					"data:video/mp4;base64,": "mp4",
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
					try {
						if (imageFormat === "mp4")
							media = new MessageMedia("video/mp4", imageData);
						else
							media = new MessageMedia(
								`image/${imageFormat}`,
								imageData
							);
					} catch (error) {
						console.error("Error al decodificar el video:", error);
					}
				}
			}
			for (const item of response) {
				const phone = item.phone.replace(/\s/g, "");
				if (image && media) {
					try {
						await client.sendMessage(`521${phone}@c.us`, media);
					} catch (error) {
						console.log("Error al enviar el video:", error);
					}
				}

				// console.log(`521${phone}@c.us`, `${message}`);
				await client.sendMessage(`521${phone}@c.us`, `${message}`);
			}
			setTimeout(() => {
				client.destroy();
				if (!res.headersSent)
					return res.status(200).json({ code: "msgsend" });
			}, 5000);
			if (!session) {
			}
		});
		console.log("pre initialize");
		client.initialize();
		console.log("post initialize");
		// return res.status(200).json({ code: "msgsend" });
	} catch (error) {
		console.error("Error:", error);
		if (!res.headersSent) res.status(500).send("Error generating QR code");
	}
});

module.exports = router;
