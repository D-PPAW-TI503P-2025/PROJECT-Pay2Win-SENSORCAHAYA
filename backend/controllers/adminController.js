const db = require('../db');

// Read all users
const getAllUsers = (req, res) => {
    db.all(`SELECT id, username, role FROM users`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
};

// Create user
const createUser = (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    db.run(
        `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
        [username, password, role],
        function (err) {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ id: this.lastID, username, role });
        }
    );
};

// Update user
const updateUser = (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;

    db.run(
        `UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?`,
        [username, password, role, id],
        function (err) {
            if (err) return res.status(500).json({ message: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
            res.json({ id, username, role });
        }
    );
};

// Delete user
const deleteUser = (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
        res.json({ message: 'User berhasil dihapus', id });
    });
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
