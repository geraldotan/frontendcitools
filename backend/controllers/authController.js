// controllers/authController.js
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const moment = require('moment');

const registerUser = async (req, res) => {
    const { login_id, password } = req.body;
  
    if (!login_id || !password) {
      return res.status(400).json({ message: 'Username/email and password are required' });
    }
  
    try {
      const newUser = await userModel.createUser(login_id, password);
      res.status(201).json({
        message: 'User registered successfully',
        user: newUser // Pastikan newUser adalah objek yang dapat di-serialisasi menjadi JSON
      });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  };
  
const loginUser = async (req, res) => {
    const { login_id, password } = req.body;

    if (!login_id || !password) {
        return res.status(400).json({ message: 'Username/email and password are required' });
    }

    try {
        const user = await userModel.getUserByLoginId(login_id);
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }

        // Membuat JWT token
        const token = jwt.sign({ userId: user.id, role: user.role || 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Menyimpan waktu login dalam format WIB
        const lastLoginTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }); // Ambil waktu WIB
        
        // Memperbarui waktu login di database
        await userModel.updateLastLogin(user.id, lastLoginTime);

        // Mengirimkan token ke client
        res.json({
            message: 'Login successful',
            token,
            username: user.login_id,
            role: user.role || 'user'
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }

}

const logoutUser = async (req, res) => {
    try {
      const userId = req.user.userId;
      const lastLogoutTime = moment().tz("Asia/Jakarta").format();
  
      await userModel.updateLastLogout(userId, lastLogoutTime);
      
  
      res.json({ message: 'Logout successful' });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ message: 'Error logging out' });
    }
  };
  
  // Fungsi lain (registerUser, loginUser, dst)
  
  module.exports = {
    registerUser,
    loginUser,
    logoutUser
  };