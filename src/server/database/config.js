const dotenv = require("dotenv").config();
const HOSTDB = process.env.HOSTDB;
const USERDB = process.env.DBUSER;
const PASSWORDDB = process.env.PASSWORDDB;
const DATABASE = process.env.DB;

const dbConfig = {
	host: HOSTDB,
	user: USERDB,
	password: PASSWORDDB,
	database: DATABASE,
	multipleStatements: true,
};

module.exports = dbConfig;
