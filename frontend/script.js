// --- KONFIGURASI ---
const BASE_URL = "http://localhost:3000/api"; 
const role = localStorage.getItem('role');

// Tampilkan panel admin jika ada
const adminPanel = document.getElementById('adminPanel');
if (adminPanel) {
  if (role === 'admin') {
    adminPanel.style.display = 'block';
  } else {
    adminPanel.style.display = 'none';
  }
}

// Jalankan script saat HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    
    // --- CEK STATUS LOGIN (PROTEKSI HALAMAN) ---
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const path = window.location.pathname;

        // 2. Jika di admin dashboard tapi belum login -> ke login
    if (path.includes('adminDashboard.html') && !isLoggedIn) {
        window.location.href = 'login.html';
    }

    // 1. Jika di dashboard user tapi belum login -> ke login
    if (path.includes('dashboard.html') && !isLoggedIn) {
        window.location.href = 'login.html';
    }

    // 3. Jika sudah login & buka login.html -> redirect sesuai role
    if (path.includes('login.html') && isLoggedIn) {
        const savedRole = localStorage.getItem('role');
        if (savedRole === 'admin') {
            window.location.href = 'adminDashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }

    // --- LOGIC HALAMAN LOGIN ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const msgElement = document.getElementById('message');

            try {
                msgElement.innerText = "Loading...";
                
                const response = await fetch(`${BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Simpan status login
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('username', data.username || username);

                    // Jika backend kirim token, simpan juga
                    if (data.token) localStorage.setItem('token', data.token);

                    // 🔥 REDIRECT SESUAI ROLE
                    if (data.role === 'admin') {
                        window.location.href = 'adminDashboard.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }

                } else {
                    msgElement.innerText = data.message || "Login Gagal";
                }
            } catch (error) {
                console.error(error);
                msgElement.innerText = "Gagal koneksi ke server.";
            }
        });
    }

    // --- LOGIC HALAMAN DASHBOARD USER ---
    const luxElement = document.getElementById('nilaiLux');
    if (luxElement) {
        // Panggil sekali saat halaman dibuka
        updateDashboard();

        // Panggil terus setiap 2 detik (Realtime)
        setInterval(updateDashboard, 2000);
    }
});

// --- FUNGSI UPDATE DASHBOARD ---
async function updateDashboard() {
    const luxElement = document.getElementById('nilaiLux');
    const statusBox = document.getElementById('statusBox');

    try {
        const response = await fetch(`${BASE_URL}/sensor/latest`);
        if (!response.ok) throw new Error("Gagal fetch data");

        const data = await response.json();

        if (!data) {
            statusBox.innerText = "Menunggu data...";
            return;
        }

        // Update Angka
        luxElement.innerText = data.nilai_lux;

        // Update Status Box
        statusBox.className = 'status-box'; // Reset class
        
        const status = data.status ? data.status.toLowerCase() : '';

        if (status === 'gelap') {
            statusBox.classList.add('bg-gelap');
            statusBox.innerText = "🌑 GELAP";
        } else if (status === 'redup') {
            statusBox.classList.add('bg-redup');
            statusBox.innerText = "🌥️ REDUP";
        } else if (status === 'terang') {
            statusBox.classList.add('bg-terang');
            statusBox.innerText = "☀️ TERANG";
        } else {
            statusBox.classList.add('bg-terang-banget');
            statusBox.innerText = "😎 TERANG BANGET";
        }

    } catch (error) {
        console.log("Error fetching sensor data:", error);
    }
}

// --- LOGOUT ---
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}
