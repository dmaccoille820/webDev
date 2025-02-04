import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function queryDatabase(query, params) {
    let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute({
      sql: query,
      values: params,
      rowsAsArray: false,
    });
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

export { queryDatabase };
