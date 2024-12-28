let packets = [];
const protocols = ["TCP", "UDP", "ICMP"];
const maxPackets = 10;
let packetCounts = [];

// Function to Generate Random Packet
function generatePacket() {
    const packet = {
        time: new Date().toLocaleTimeString(),
        source: `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
        destination: `10.0.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        size: Math.floor(Math.random() * 1500) + 64,
    };
    packets.push(packet);
    if (packets.length > maxPackets) packets.shift();

    const currentTime = new Date().toLocaleTimeString();
    packetCounts.push({ time: currentTime, count: packets.length });
    if (packetCounts.length > 20) packetCounts.shift();

    updateTable();
    updateCharts();
}

// Filters
function applyFilters() {
    const protocol = document.getElementById("protocolFilter").value;
    const ip = document.getElementById("ipFilter").value;

    const filteredPackets = packets.filter(packet => {
        const protocolMatch = protocol === "All" || packet.protocol === protocol;
        const ipMatch = ip === "" || packet.source.includes(ip) || packet.destination.includes(ip);
        return protocolMatch && ipMatch;
    });

    updateTable(filteredPackets);
}

// Update Table with Packets
function updateTable(filteredPackets = packets) {
    const tableBody = document.getElementById("packetTableBody");
    tableBody.innerHTML = filteredPackets.map(packet => `
        <tr>
            <td>${packet.time}</td>
            <td>${packet.source}</td>
            <td>${packet.destination}</td>
            <td>${packet.protocol}</td>
            <td>${packet.size}</td>
        </tr>
    `).join("");
}

// Chart.js Visualizations
const ctxTraffic = document.getElementById("trafficChart").getContext("2d");
const ctxTimeSeries = document.getElementById("timeSeriesChart").getContext("2d");

const trafficChart = new Chart(ctxTraffic, {
    type: "bar",
    data: {
        labels: protocols,
        datasets: [{
            label: "Packet Count",
            data: [0, 0, 0],
            backgroundColor: ["#007bff", "#28a745", "#ffc107"],
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const timeSeriesChart = new Chart(ctxTimeSeries, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Packets Over Time",
            data: [],
            borderColor: "#007bff",
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Update Charts
function updateCharts() {
    const counts = { TCP: 0, UDP: 0, ICMP: 0 };
    packets.forEach(packet => counts[packet.protocol]++);
    trafficChart.data.datasets[0].data = [counts.TCP, counts.UDP, counts.ICMP];
    trafficChart.update();

    timeSeriesChart.data.labels = packetCounts.map(pc => pc.time);
    timeSeriesChart.data.datasets[0].data = packetCounts.map(pc => pc.count);
    timeSeriesChart.update();
}

// Event Listeners
document.getElementById("applyFilter").addEventListener("click", applyFilters);

document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});
// Simulate Packets Every 2 Seconds
setInterval(generatePacket, 2000);
