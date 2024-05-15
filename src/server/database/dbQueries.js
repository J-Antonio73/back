const dotenv = require("dotenv").config();
const mysql = require("mysql");
const mysql2 = require("mysql2");
const db = require("./config");

const updateToken = (values = []) => {
	try {
		const pool = mysql.createPool(db);
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				const sql = "UPDATE usuarios SET access_token = ? WHERE id = ?";
				connection.query(sql, values, (err, rows) => {
					if (err) {
						console.log(err);
						reject(err);
					}
					resolve(rows);
				});
			});
		});
	} catch (error) {
		console.log(error);
	}
};

// const updateToken = async (values = []) => {
// 	try {
// 		const pool = await mysql2.createConnection(process.env.DATABASE_URL);
// 		return new Promise((resolve, reject) => {
// 			pool.query(
// 				"UPDATE usuarios SET access_token = ? WHERE id = ?",
// 				values,
// 				(err, rows) => {
// 					if (err) {
// 						console.log(err);
// 						reject(err);
// 					}
// 					pool.end();
// 					resolve(rows);
// 				}
// 			);
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		throw error;
// 	}
// };

const getUser = (values = []) => {
	try {
		const pool = mysql.createPool(db);
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				const sql =
					"SELECT id, username, password FROM usuarios WHERE username = ?";
				connection.query(sql, values, (err, rows) => {
					if (err) {
						console.log(err);
						reject(err);
					}
					resolve(rows);
				});
			});
		});
	} catch (error) {
		console.log(error);
	}
};

// const getUser = async (values = []) => {
// 	try {
// 		const pool = await mysql2.createConnection(process.env.DATABASE_URL);
// 		return new Promise((resolve, reject) => {
// 			pool.query(
// 				"SELECT id, username, password FROM usuarios WHERE username = ?",
// 				values,
// 				(err, rows) => {
// 					if (err) {
// 						console.log(err);
// 						reject(err);
// 					}
// 					pool.end();
// 					resolve(rows);
// 				}
// 			);
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		throw error;
// 	}
// };

const createCustomer = (values = []) => {
	try {
		const pool = mysql.createPool(db);
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				const sql =
					"INSERT INTO clientes (firstname, lastname, phone, email, `group`) VALUES (?, ?, ?, ?, ?)";
				connection.query(sql, values, (err, rows) => {
					if (err) {
						console.log(err);
						reject(err);
					}
					resolve(rows);
				});
			});
		});
	} catch (error) {
		console.log(error);
	}
};

// const createCustomer = async (values = []) => {
// 	try {
// 		const pool = await mysql2.createConnection(process.env.DATABASE_URL);
// 		return new Promise((resolve, reject) => {
// 			pool.query(
// 				"INSERT INTO clientes (firstname, lastname, phone, email) VALUES (?, ?, ?, ?)",
// 				values,
// 				(err, rows) => {
// 					if (err) {
// 						console.log(err);
// 						reject(err);
// 					}
// 					pool.end();
// 					resolve(rows);
// 				}
// 			);
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		throw error;
// 	}
// };

const getCustomers = (group = 0) => {
	try {
		const pool = mysql.createPool(db);
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				let sql;
				if (group === 0) {
					sql =
						"SELECT *, CONCAT(firstname, ' ', lastname) AS fullname FROM clientes";
				} else {
					sql = `SELECT *, CONCAT(firstname, ' ', lastname) AS fullname FROM clientes WHERE \`group\` = ${group}`;
				}
				connection.query(sql, (err, rows) => {
					if (err) {
						console.log(err);
						reject(err);
					}
					resolve(rows);
				});
			});
		});
	} catch (error) {
		console.log(error);
	}
};

// const getCustomers = async () => {
// 	try {
// 		const pool = await mysql2.createConnection(process.env.DATABASE_URL);
// 		return new Promise((resolve, reject) => {
// 			pool.query(
// 				"SELECT *, CONCAT(firstname, ' ', lastname) AS fullname FROM clientes",
// 				(err, rows) => {
// 					if (err) {
// 						console.log(err);
// 						reject(err);
// 					}
// 					pool.end();
// 					resolve(rows);
// 				}
// 			);
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		throw error;
// 	}
// };

const updateCustomer = (values = []) => {
	try {
		const pool = mysql.createPool(db);
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				const sql =
					"UPDATE clientes SET firstname = ?, lastname = ?, phone = ?, email = ?, `group` = ? WHERE id = ?";
				connection.query(sql, values, (err, rows) => {
					if (err) {
						console.log(err);
						reject(err);
					}
					resolve(rows);
				});
			});
		});
	} catch (error) {
		console.log(error);
	}
};

// const updateCustomer = async (values = []) => {
// 	try {
// 		const pool = await mysql2.createConnection(process.env.DATABASE_URL);
// 		return new Promise((resolve, reject) => {
// 			pool.query(
// 				"UPDATE clientes SET firstname = ?, lastname = ?, phone = ?, email = ? WHERE id = ?",
// 				values,
// 				(err, rows) => {
// 					if (err) {
// 						console.log(err);
// 						reject(err);
// 					}
// 					pool.end();
// 					resolve(rows);
// 				}
// 			);
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		throw error;
// 	}
// };

const deleteCustomer = (id) => {
	try {
		const pool = mysql.createPool(db);
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				// const sql = "DELETE FROM clientes";
				const sql = "DELETE FROM clientes WHERE id = ?";
				connection.query(sql, id, (err, rows) => {
					if (err) {
						console.log(err);
						reject(err);
					}
					resolve(rows);
				});
			});
		});
	} catch (error) {
		console.log(error);
	}
};

const getDistritos = () => {
	try {
		const pool = mysql.createPool(db);
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				const sql = "SELECT `group` FROM clientes GROUP BY `group`";
				connection.query(sql, (err, rows) => {
					if (err) {
						console.log(err);
						reject(err);
					}
					resolve(rows);
				});
			});
		});
	} catch (error) {
		console.log(error);
	}
};

// const deleteCustomer = async (id) => {
// 	try {
// 		const pool = await mysql2.createConnection(process.env.DATABASE_URL);
// 		return new Promise((resolve, reject) => {
// 			pool.query("DELETE FROM clientes WHERE id = ?", id, (err, rows) => {
// 				if (err) {
// 					console.log(err);
// 					reject(err);
// 				}
// 				pool.end();
// 				resolve(rows);
// 			});
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		throw error;
// 	}
// };

module.exports = {
	createCustomer,
	getCustomers,
	updateCustomer,
	deleteCustomer,
	updateToken,
	getUser,
	getDistritos,
};
