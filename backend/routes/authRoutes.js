// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController'); // Impor authController

// Route untuk registrasi
router.post('/register', registerUser);

// Route untuk login
router.post('/login', loginUser);

// Route untuk logout
router.post('/logout', verifyToken, authController.logoutUser); // Menggunakan logoutUser dari authController


router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
