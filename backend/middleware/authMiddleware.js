
const db = require('../db');

// sementara login tanpa JWT, kita pakai query param role
const isAdmin = (req, res, next) => {
    // contoh: role di query ?role=admin (sementara)
    // nanti bisa pakai login session / JWT
    if (req.query.role !== 'admin') {
        return res.status(403).json({ message: 'Hanya admin yang bisa mengakses' });
    }
    next();
};

module.exports = { isAdmin };
