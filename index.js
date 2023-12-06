const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const rutas = require("./src/server/routes");
const PORT = process.env.PORT || 3001;

// app.use(
// 	cors({
// 		origin: `${process.env.CLIENT_URL}`,
// 		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// 		credentials: true,
// 	})
// );

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", rutas);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
	console.log(`${process.env.CLIENT_URL}`);
});
