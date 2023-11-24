const express = require("express");
const app = express();
const cors = require("cors");
const msgRoute = require("./src/server/messageRoute");
const PORT = process.env.PORT || 3001;

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", msgRoute);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
