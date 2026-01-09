const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000; // Port frontend dibedakan dengan backend (3000)

// Mengizinkan akses ke file statis (html, js, css) di folder frontend
app.use(express.static(__dirname));

// Route untuk halaman utama (Login/Home)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route untuk halaman Dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Route untuk halaman Kelola User (Admin)
app.get('/admin-user', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-user.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Frontend aktif di: http://localhost:${PORT}`);
});