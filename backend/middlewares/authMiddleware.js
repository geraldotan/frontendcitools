const jwt = require('jsonwebtoken');

// Middleware untuk memverifikasi JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Ambil token dari header 'Authorization'

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  // Verifikasi token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Simpan data decoded token di request untuk digunakan di route berikutnya
    req.user = decoded;
    next();
  });
};

module.exports = {
  verifyToken
};
