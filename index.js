const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const rutas = require("./src/server/routes");
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Configuración de CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas API
app.use("/api", rutas);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
