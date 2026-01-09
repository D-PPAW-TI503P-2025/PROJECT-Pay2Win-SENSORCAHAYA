let chart;
function initChart() {
    const ctx = document.getElementById('sensorChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Intensitas (Lux)',
                data: [],
                borderColor: '#2563eb',
                tension: 0.3,
                fill: true,
                backgroundColor: 'rgba(37, 99, 235, 0.05)'
            }]
        }
    });
}

async function fetchSensor() {
    const res = await fetch('http://localhost:3000/api/sensor');
    const data = await res.json();
    if (data.length > 0) {
        const latest = data[0];
        document.getElementById('latestLux').innerHTML = `${latest.nilai_lux} <small class="text-2xl font-normal text-slate-400 italic">Lux</small>`;
        
        const badge = document.getElementById('latestStatus');
        badge.innerText = latest.status;
        badge.style.backgroundColor = latest.status === 'gelap' ? '#1e293b' : (latest.status === 'redup' ? '#fb923c' : '#22c55e');

        const recent = data.slice(0, 10).reverse();
        chart.data.labels = recent.map(i => new Date(i.timestamp).toLocaleTimeString());
        chart.data.datasets[0].data = recent.map(i => i.nilai_lux);
        chart.update();

        document.getElementById('sensorTable').innerHTML = data.map(i => `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-4 font-mono text-slate-400 text-sm">${new Date(i.timestamp).toLocaleString()}</td>
                <td class="p-4 font-black text-blue-600 tracking-tight">${i.nilai_lux} Lux</td>
                <td class="p-4 uppercase text-[10px] font-black italic">${i.status.replace('_', ' ')}</td>
            </tr>
        `).join('');
    }
}

initChart();
fetchSensor();
setInterval(fetchSensor, 5000);