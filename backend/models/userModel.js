// models/userModel.js
require('dotenv').config();
const { Client } = require('pg');

// Setup koneksi PostgreSQL
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Koneksi ke database
client.connect();

// Fungsi untuk insert user baru
// models/userModel.js
const moment = require('moment-timezone');

const createUser = async (login_id, password) => {
  try {
    const query = 'INSERT INTO users (login_id, password, created_at) VALUES ($1, $2, $3) RETURNING *';
    const createdAt = moment().tz("Asia/Jakarta").format(); // created_at dalam WIB
    const result = await client.query(query, [login_id, password, createdAt]);
    return result.rows[0];
  } catch (err) {
    console.error('Error inserting data:', err);
    throw err;
  }
};

const getUserByLoginId = async (login_id) => {
    try {
      const query = 'SELECT * FROM users WHERE login_id = $1';
      const result = await client.query(query, [login_id]);
      return result.rows[0];
    } catch (err) {
      console.error('Error fetching user:', err);
      throw err;
    }
  };

// models/userModel.js

const updateLastLogin = async (userId, lastLoginTime) => {
    try {
      const query = 'UPDATE users SET last_login = $1 WHERE id = $2';
      await client.query(query, [lastLoginTime, userId]);
    } catch (err) {
      console.error('Error updating last login time:', err);
      throw err;
    }
  };

  // Tambahkan fungsi baru di userModel.js
const updateLastLogout = async (userId, lastLogoutTime) => {
  const query = 'UPDATE users SET last_logout = $1 WHERE id = $2';
  await client.query(query, [lastLogoutTime, userId]);
};

module.exports = {
  createUser,
  getUserByLoginId,
  updateLastLogin,
  updateLastLogout
};

  