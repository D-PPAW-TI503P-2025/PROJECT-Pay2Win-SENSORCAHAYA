// --- KONFIGURASI ---
const BASE_URL = "http://localhost:3000/api"; 

// Jalankan script saat HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    
    // --- CEK STATUS LOGIN (PROTEKSI HALAMAN) ---
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const path = window.location.pathname;

    // 1. Jika di Dashboard tapi belum login -> Tendang ke Login
    if (path.includes('dashboard.html') && !isLoggedIn) {
        window.location.href = 'login.html';
    }

    // 2. Jika di Login tapi sudah login -> Langsung ke Dashboard
    if (path.includes('login.html') && isLoggedIn) {
        window.location.href = 'dashboard.html';
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
                    
                    // PENTING: Jika backend mengirim token, simpan juga!
                    if (data.token) localStorage.setItem('token', data.token);

                    window.location.href = 'dashboard.html';
                } else {
                    msgElement.innerText = data.message || "Login Gagal";
                }
            } catch (error) {
                console.error(error);
                msgElement.innerText = "Gagal koneksi ke server.";
            }
        });
    }

    // --- LOGIC HALAMAN DASHBOARD ---
    // Cek apakah element dashboard ada (supaya tidak error di halaman login)
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
        
        // Pastikan huruf kecil semua agar cocok dengan kondisi if
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
            // Default atau Terang Banget
            statusBox.classList.add('bg-terang-banget');
            statusBox.innerText = "😎 TERANG BANGET";
        }

    } catch (error) {
        console.log("Error fetching sensor data:", error);
        // Opsional: Tampilkan error kecil di UI jika mau
    }
}

// --- LOGOUT (Harus di luar DOMContentLoaded agar bisa dipanggil onclick HTML) ---
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}