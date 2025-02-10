const mysql = require('mysql2/promise');
const dbConfig = require('./dbConfig');

const pool = mysql.createPool(dbConfig);

async function queryDatabase(sql, params) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('queryDatabase - Error executing query:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

module.exports = queryDatabase;