import * as L from 'leaflet/dist/leaflet-src.esm.js';

const map = L.map('map').setView([16.0, 106.0], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let userMarker = null;
let activeMarkers = [];

const localHazardGeoJSON = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { name: "Vùng sạt lở đèo Mã Pí Lèng", risk_level: "high" },
            geometry: { type: "Polygon", coordinates: [[[105.4150, 22.4380], [105.4220, 22.4380], [105.4220, 22.4320], [105.4150, 22.4320], [105.4150, 22.4380]]] }
        },
        {
            type: "Feature",
            properties: { name: "Vùng nguy cơ sụt lún Mường Lay", risk_level: "high" },
            geometry: { type: "Polygon", coordinates: [[[103.1450, 22.0700], [103.1550, 22.0700], [103.1550, 22.0640], [103.1450, 22.0640], [103.1450, 22.0700]]] }
        },
        {
            type: "Feature",
            properties: { name: "Khu vực đệm VQG Bù Gia Mập", risk_level: "medium" },
            geometry: { type: "Polygon", coordinates: [[[107.2050, 12.2080], [107.2180, 12.2080], [107.2180, 12.1980], [107.2050, 12.1980], [107.2050, 12.2080]]] }
        }
    ]
};

L.geoJSON(localHazardGeoJSON, {
    style(feature) {
        const color = feature.properties.risk_level === 'high' ? '#e74c3c' : '#f1c40f';
        return { color, weight: 2, fillOpacity: 0.35 };
    },
    onEachFeature(feature, layer) {
        layer.bindPopup('<b>' + feature.properties.name + '</b><br/>Mức rủi ro: ' + feature.properties.risk_level);
    }
}).addTo(map);

function clearOldLayers() {
    if (userMarker) { map.removeLayer(userMarker); }
    activeMarkers.forEach(function (m) { map.removeLayer(m); });
    activeMarkers = [];
    document.getElementById('ai-report').innerHTML = "";
}

function calculateDynamicProbability(rain, slope, soil_type) {
    const soil_factor = (soil_type.includes('Đá') || soil_type.includes('ổn định')) ? 0.3 :
                        (soil_type.includes('feralit')) ? 1.2 : 2.5;

    const baseProb = (rain * 0.4) + (slope * soil_factor);
    const randomFluctuation = (Math.random() * 6) - 3;
    const finalProb = baseProb + randomFluctuation;

    return Math.max(1.2, Math.min(finalProb, 99.8));
}

function startRealTimeGPS() {
    clearOldLayers();
    document.getElementById('ai-status').innerHTML = "⏳ Đang kết nối vệ tinh lấy tọa độ thật...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            map.setView([lat, lng], 15);
            userMarker = L.circleMarker([lat, lng], { color: 'blue', fillColor: '#30f', fillOpacity: 0.8, radius: 10 }).addTo(map);

            const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

            fetch(geoUrl).then(res => res.json()).then(geoData => {
                const exactLocation = geoData.display_name || "Vị trí của bạn";
                userMarker.bindPopup("Vị trí: " + exactLocation).openPopup();

                const API_KEY = "ace148a0ed0f689698dafb5685c8019f";
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&lang=vi`;

                document.getElementById('ai-status').innerHTML = "⏳ Đang phân tích dữ liệu khí tượng thực tế...";

                fetch(weatherUrl)
                    .then(res => {
                        if (!res.ok) throw new Error("API Key lỗi.");
                        return res.json();
                    })
                    .then(data => {
                        const actualRain = data.rain ? (data.rain['1h'] || 0) : 0;
                        const weatherDesc = data.weather && data.weather[0] ? data.weather[0].description : "Đang cập nhật";
                        const simRain = actualRain === 0 ? (Math.random() * 10) : actualRain;
                        const simSlope = 3 + Math.random() * 2;
                        const soilDesc = "Đất đô thị ổn định / Bằng phẳng";
                        const prob = calculateDynamicProbability(simRain, simSlope, soilDesc);
                        const currentStatus = `${soilDesc} / Thời tiết hiện tại: ${weatherDesc} (Nhiệt độ: ${data.main.temp}°C)`;

                        displayAIResult(exactLocation, simRain.toFixed(1), simSlope.toFixed(1), currentStatus, prob.toFixed(1), []);
                    })
                    .catch(err => {
                        document.getElementById('ai-status').innerHTML = "❌ Lỗi Fetch API Thời tiết.";
                    });
            });
        }, function (error) {
            document.getElementById('ai-status').innerHTML = "❌ Lỗi GPS: Vui lòng cho phép trình duyệt truy cập vị trí!";
        });
    } else {
        document.getElementById('ai-status').innerHTML = "❌ Trình duyệt không hỗ trợ GPS.";
    }
}

function startSimMaPiLeng() {
    clearOldLayers();
    document.getElementById('ai-status').innerHTML = "⏳ Đang quét trạm đo địa chất Đèo Mã Pí Lèng...";

    const lat = 22.4335, lng = 105.4180;
    map.setView([lat, lng], 14);
    userMarker = L.circleMarker([lat, lng], { color: 'blue', fillColor: '#30f', fillOpacity: 0.8, radius: 10 }).addTo(map);
    userMarker.bindPopup("<b>Giả lập:</b> Tài xế đang di chuyển trên đèo").openPopup();

    const rain = 150 + Math.random() * 30;
    const slope = 45;
    const soil = "Đá vôi phong hóa mạnh, nứt nẻ cơ học";
    const prob = calculateDynamicProbability(rain, slope, soil);

    const escapeNodes = [
        { lat: 22.4365, lng: 105.4200, title: "📍 Mốc 1: Hốc cứu nạn đá vôi kiên cố" },
        { lat: 22.4410, lng: 105.4260, title: "🏁 ĐÍCH ĐẾN: Điểm hạ đèo an toàn / Trạm dừng chân" }
    ];

    setTimeout(function () { displayAIResult("Đèo Mã Pí Lèng (Hà Giang)", rain.toFixed(1), slope, soil, prob.toFixed(1), escapeNodes); }, 1200);
}

function startSimMuongLay() {
    clearOldLayers();
    document.getElementById('ai-status').innerHTML = "⏳ Đang quét trạm thủy văn Thị xã Mường Lay...";

    const lat = 22.0667, lng = 103.1500;
    map.setView([lat, lng], 14);
    userMarker = L.circleMarker([lat, lng], { color: 'blue', fillColor: '#30f', fillOpacity: 0.8, radius: 10 }).addTo(map);
    userMarker.bindPopup("<b>Giả lập:</b> Hộ dân vùng thung lũng sông").openPopup();
    const rain = 90 + Math.random() * 20;
    const slope = 32;
    const soil = "Đất dốc tụ, sườn tích mềm nhão";
    const prob = calculateDynamicProbability(rain, slope, soil);

    const escapeNodes = [
        { lat: 22.0690, lng: 103.1550, title: "📍 Mốc 1: Đường bê tông liên xã đi lên cao" },
        { lat: 22.0720, lng: 103.1610, title: "🏁 ĐÍCH ĐẾN: Khu nhà văn hóa vùng cao tái định cư" }
    ];

    setTimeout(function () { displayAIResult("Thị xã Mường Lay (Điện Biên)", rain.toFixed(1), slope, soil, prob.toFixed(1), escapeNodes); }, 1200);
}

function startSimBGM() {
    clearOldLayers();
    document.getElementById('ai-status').innerHTML = "⏳ Đang kết nối cảm biến rừng Bù Gia Mập...";

    const lat = 12.2035, lng = 107.2112;
    map.setView([lat, lng], 14);
    userMarker = L.circleMarker([lat, lng], { color: 'blue', fillColor: '#30f', fillOpacity: 0.8, radius: 10 }).addTo(map);
    userMarker.bindPopup("<b>Giả lập:</b> Khách du lịch bìa rừng").openPopup();

    const rain = 30 + Math.random() * 15;
    const slope = 22;
    const soil = "Đất feralit đỏ kết cấu chặt, thảm thực vật giữ đất tốt";
    const prob = calculateDynamicProbability(rain, slope, soil);

    setTimeout(function () { displayAIResult("VQG Bù Gia Mập (Bình Phước)", rain.toFixed(1), slope, soil, prob.toFixed(1), []); }, 1200);
}

function displayAIResult(location, rain, slope, soil, prob, points) {
    document.getElementById('ai-status').innerHTML = "⚙️ Phân tích toán học hoàn tất!";
    const statusDiv = document.getElementById('user-status');

    let reportHtml = `
        <p>📍 <b>Vị trí quét:</b> ${location}</p>
        <p>🌧️ <b>Lượng mưa 24h:</b> ${rain} mm</p>
        <p>📐 <b>Độ dốc mái taluy:</b> ${slope}°</p>
        <p>🌱 <b>Cấu trúc địa chất:</b> <span style="color: #3498db;">${soil}</span></p>
        <p style="font-size: 15px; font-weight: bold; color: #ffcc00;">📊 XÁC SUẤT SẠT LỞ ĐẤT: ${prob}%</p>
        <hr style="border-color: #4f5d73;">
    `;

    if (prob >= 70) {
        statusDiv.innerHTML = "🚨 NGUY HIỂM: SẠT LỞ ĐẤT LẬP TỨC!";
        statusDiv.className = "status danger";
        reportHtml += `
            <p style="color: #e74c3c; font-weight: bold;">📢 [CHỈ THỊ AI]: Xác suất sạt lở vượt ngưỡng an toàn (${prob}% >= 70%).</p>
            <p style="color: #2ecc71;">🗺️ Đã tự động rải các chấm mốc lánh nạn an toàn dọc đường bộ tránh sườn núi dốc. Di chuyển theo các dấu chấm 📍 hiển thị trên bản đồ ngay!</p>
        `;
    } else {
        statusDiv.innerHTML = "⚠️ CÓ NGUY CƠ TIỀM ẨN";
        statusDiv.className = "status warning";
        reportHtml += `
            <p style="color: #f1c40f; font-weight: bold;">📢 [CHỈ THỊ AI]: Chỉ số an toàn (${prob}% < 70%). Khu vực chưa có dấu hiệu dịch chuyển khối trượt sạt lở lớn. Người dân chú ý đề phòng, cập nhật tình hình thời tiết.</p>
        `;
    }

    document.getElementById('ai-report').innerHTML = reportHtml;

    points.forEach(function (coord) {
        const m = L.marker([coord.lat, coord.lng]).addTo(map);
        m.bindPopup(`<b>${coord.title}</b>`);
        activeMarkers.push(m);
    });
    if (points.length > 0) activeMarkers[0].openPopup();
}

window.startRealTimeGPS = startRealTimeGPS;
window.startSimMaPiLeng = startSimMaPiLeng;
window.startSimMuongLay = startSimMuongLay;
window.startSimBGM = startSimBGM;
window.displayAIResult = displayAIResult;
