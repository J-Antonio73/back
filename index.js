const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const rutas = require("./src/server/routes");
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use("/api", rutas);
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    console.log(`${process.env.CLIENT_URL}`);
});
