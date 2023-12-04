const express = require("express");
const app = express();
const cors = require("cors");
const rutas = require("./src/server/routes");
const PORT = process.env.PORT || 3001;

app.use(
	cors({
		origin: `${process.env.CLIENT_URL}`,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", rutas);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
