
const mysql = require('mysql2/promise');

const db = mysql.createPool(process.env.DATABASE_URL);

module.exports = db;