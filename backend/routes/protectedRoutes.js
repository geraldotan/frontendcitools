const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Ini adalah route yang dilindungi', user: req.user });
});

module.exports = router;
