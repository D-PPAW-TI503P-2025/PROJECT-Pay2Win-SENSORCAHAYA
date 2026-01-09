// Mengambil data user yang tersimpan setelah login
const userData = JSON.parse(localStorage.getItem('user'));

function updateNav() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;

    // Menu "Home" selalu tampil untuk semua orang
    let menuHtml = `<a href="index.html" class="hover:text-blue-200 transition">Home</a>`;

    if (!userData) {
        // --- KONDISI BELUM LOGIN ---
        // Sembunyikan Dashboard, tampilkan Login dan Register
        menuHtml += `
            <button onclick="showLogin()" class="bg-white text-blue-600 px-6 py-2 rounded-full font-bold shadow-md hover:bg-blue-50 transition ml-2">Login</button>
            <button onclick="showRegister()" class="bg-blue-500 text-white px-6 py-2 rounded-full font-bold border border-blue-400 hover:bg-blue-700 transition">Register</button>
        `;
    } else {
        // --- KONDISI SUDAH LOGIN ---
        // Dashboard muncul untuk semua user/admin yang sudah login
        menuHtml += `<a href="dashboard.html" class="hover:text-blue-200 transition">Dashboard</a>`;
        
        // Menu "Kelola User" hanya muncul jika role adalah admin
        if (userData.role === 'admin') {
            menuHtml += `<a href="admin-user.html" class="text-yellow-300 font-bold hover:text-yellow-100 transition">Kelola User</a>`;
        }
        
        // Menampilkan nama user dan tombol Logout
        menuHtml += `
            <span class="text-blue-100 text-sm italic ml-4">Halo, ${userData.username}</span>
            <button onclick="logout()" class="bg-red-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-200">Logout</button>
        `;
    }
    navMenu.innerHTML = menuHtml;
}

// Fungsi untuk berpindah tampilan ke Form Login
function showLogin() {
    // Jika sedang tidak di halaman index, arahkan balik ke index dengan parameter login
    if (window.location.pathname !== '/' && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html?action=login';
        return;
    }
    document.getElementById('homeContent').classList.add('hidden');
    document.getElementById('registerSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
}

// Fungsi untuk berpindah tampilan ke Form Register
function showRegister() {
    if (window.location.pathname !== '/' && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html?action=register';
        return;
    }
    document.getElementById('homeContent').classList.add('hidden');
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('registerSection').classList.remove('hidden');
}

// Handler Submit Login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').onsubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: document.getElementById('username').value,
                    password: document.getElementById('password').value
                })
            });
            const data = await res.json();
            
            if (res.ok) {
                // Simpan username dan role
                localStorage.setItem('user', JSON.stringify({ 
                    role: data.role, 
                    username: document.getElementById('username').value 
                }));
                // Refresh halaman agar navbar berubah berdasarkan role
                location.href = 'index.html'; 
            } else {
                alert('Login gagal: ' + data.message);
            }
        } catch (err) {
            alert('Gagal terhubung ke server.');
        }
    };
}

// Handler Submit Register
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').onsubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: document.getElementById('regUsername').value,
                    password: document.getElementById('regPassword').value
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Registrasi Berhasil! Silakan Login.');
                showLogin(); // Arahkan user ke form login setelah register sukses
            } else {
                alert('Registrasi gagal: ' + data.message);
            }
        } catch (err) {
            alert('Gagal terhubung ke server.');
        }
    };
}

function logout() {
    localStorage.clear();
    location.href = 'index.html';
}

// Menangani aksi otomatis jika diarahkan dari halaman lain (via URL param)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('action') === 'login') showLogin();
if (urlParams.get('action') === 'register') showRegister();

// Jalankan fungsi update navbar saat file dimuat
updateNav();