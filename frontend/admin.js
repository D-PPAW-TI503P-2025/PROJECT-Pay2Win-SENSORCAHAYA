const BASE_URL = 'http://localhost:3000/api/admin/users';
const ROLE_PARAM = '?role=admin'; // Parameter wajib sesuai authMiddleware.js
const userAuthData = JSON.parse(localStorage.getItem('user'));

// Deklarasi elemen input
const modalUsername = document.getElementById('modalUsername');
const modalPassword = document.getElementById('modalPassword');
const modalRole = document.getElementById('modalRole');
const userIdInput = document.getElementById('userId');

async function fetchUsers() {
    if (!userAuthData || userAuthData.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    try {
        // Fetch menggunakan BASE_URL + ROLE_PARAM
        const res = await fetch(`${BASE_URL}${ROLE_PARAM}`);
        const users = await res.json();
        
        const tbody = document.getElementById('userList');
        if (!Array.isArray(users)) return;

        tbody.innerHTML = users.map(user => `
            <tr class="hover:bg-slate-50 transition-colors border-b">
                <td class="p-4 text-slate-500 font-mono text-sm text-center">${user.id}</td>
                <td class="p-4 font-semibold text-slate-700">${user.username}</td>
                <td class="p-4 text-center">
                    <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase italic">
                        ${user.role}
                    </span>
                </td>
                <td class="p-4 text-center space-x-4">
                    <button onclick="editUser(${user.id}, '${user.username}', '${user.role}')" class="text-indigo-600 hover:text-indigo-800 font-bold text-sm italic">Edit</button>
                    <button onclick="deleteUser(${user.id})" class="text-red-500 hover:text-red-700 font-bold text-sm italic">Hapus</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Gagal memuat data user:", err);
    }
}

async function deleteUser(id) {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
        try {
            // Perbaikan URL: ID dulu baru parameter role
            const url = `${BASE_URL}/${id}${ROLE_PARAM}`;
            const res = await fetch(url, { method: 'DELETE' });
            const result = await res.json();
            
            if (res.ok) {
                alert(result.message || "User berhasil dihapus");
                fetchUsers();
            } else {
                alert("Gagal: " + result.message);
            }
        } catch (err) {
            alert("Gagal menghapus user.");
        }
    }
}

document.getElementById('userForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const id = userIdInput.value;
    const payload = {
        username: modalUsername.value,
        password: modalPassword.value, 
        role: modalRole.value
    };

    const method = id ? 'PUT' : 'POST';
    // Perbaikan URL: Jika Edit, ID masuk ke dalam path sebelum parameter
    const url = id 
        ? `${BASE_URL}/${id}${ROLE_PARAM}` 
        : `${BASE_URL}${ROLE_PARAM}`;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            alert(id ? 'User berhasil diperbarui' : 'User berhasil ditambahkan');
            closeModal();
            fetchUsers();
        } else {
            alert("Error: " + (data.message || "Terjadi kesalahan"));
        }
    } catch (err) {
        alert("Gagal menghubungi server.");
    }
};

function openModal() {
    document.getElementById('userModal').classList.remove('hidden');
    document.getElementById('modalTitle').innerText = 'Tambah User Baru';
    document.getElementById('userForm').reset();
    userIdInput.value = '';
    modalPassword.required = true; 
}

function closeModal() {
    document.getElementById('userModal').classList.add('hidden');
}

function editUser(id, username, role) {
    openModal();
    document.getElementById('modalTitle').innerText = 'Edit Data User';
    userIdInput.value = id;
    modalUsername.value = username;
    modalRole.value = role;
    modalPassword.placeholder = "Isi password baru/lama";
    // Opsional: Hilangkan required saat edit jika backend mengizinkan password kosong
    // modalPassword.required = false; 
}

fetchUsers();