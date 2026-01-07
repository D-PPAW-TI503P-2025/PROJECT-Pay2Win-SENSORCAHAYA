const db = require('../db');

const login = (req, res) => {
    const { username, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE username = ? AND password = ?`,
        [username, password],
        (err, user) => {
            if (err) return res.status(500).json(err);
            if (!user) return res.status(401).json({ message: 'Login gagal' });

            res.json({
                message: 'Login berhasil',
                role: user.role
            });
        }
    );
};

const register = (req, res) => {
    const { username, password } = req.body;

    db.run(
        `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
        [username, password, 'user'],
        function (err) {
            if (err) return res.status(500).json(err);

            res.json({
                message: 'Register berhasil',
                id: this.lastID,
                username
            });
        }
    );
};

module.exports = { login, register };
