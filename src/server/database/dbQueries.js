const dotenv = require("dotenv").config();
const mysql = require("mysql");
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

const createCustomer = (values = []) => {
	try {
		const pool = mysql.createPool(db);
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				const sql =
					"INSERT INTO clientes (firstname, lastname, phone, email) VALUES (?, ?, ?, ?)";
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

const getCustomers = () => {
	try {
		const pool = mysql.createPool(db);
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				const sql =
					"SELECT *, CONCAT(firstname, ' ', lastname) AS fullname FROM clientes";
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

const updateCustomer = (values = []) => {
	try {
		const pool = mysql.createPool(db);
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				const sql =
					"UPDATE clientes SET firstname = ?, lastname = ?, phone = ?, email = ? WHERE id = ?";
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

const deleteCustomer = (id) => {
	try {
		const pool = mysql.createPool(db);
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
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

module.exports = {
	createCustomer,
	getCustomers,
	updateCustomer,
	deleteCustomer,
	updateToken,
	getUser,
};
