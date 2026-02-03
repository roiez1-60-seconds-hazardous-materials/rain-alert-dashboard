/**
 * Rain Alert Dashboard - REAL TIME ONLY
 */

const CONFIG = {
    UPDATE_INTERVAL: 5 * 60 * 1000, // עדכון כל 5 דקות
    MAP_CENTER: [31.5, 34.75],
    MAP_ZOOM: 8
};

let map = null;
let settlementsData = [];

async function init() {
    initializeMap();
    await loadSettlementsData();
    await fetchRadarData(); // משיכת נתונים אמיתיים
    setInterval(fetchRadarData, CONFIG.UPDATE_INTERVAL);
    
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
    }, 1000);
}

function initializeMap() {
    map = L.map('radarMap').setView(CONFIG.MAP_CENTER, CONFIG.MAP_ZOOM);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

async function loadSettlementsData() {
    try {
        const response = await fetch('settlements.json');
        settlementsData = await response.json();
    } catch (e) { console.error("Error loading cities"); }
}

async function fetchRadarData() {
    try {
        // המערכת מחפשת את הקובץ שה-Actions מייצר מהמכ"ם האמיתי
        const response = await fetch('/latest_analysis.json');
        if (!response.ok) {
            console.log("מחכה לנתוני מכם אמיתיים...");
            return;
        }
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.log("עדיין אין נתוני מכם זמינים");
    }
}

function updateDashboard(data) {
    // עדכון המונים במסך
    document.getElementById('countWarning').textContent = data.alerts.warning || 0;
    document.getElementById('countDanger').textContent = data.alerts.danger || 0;
    document.getElementById('countSevere').textContent = data.alerts.severe || 0;
    document.getElementById('coveragePercent').textContent = data.coverage.toFixed(1) + '%';
    
    // הצגת רשימת היישובים שבאמת יורד בהם גשם
    const list = document.getElementById('settlementsList');
    list.innerHTML = '';
    
    if (data.settlements.length === 0) {
        list.innerHTML = '<div class="no-rain">אין גשם כרגע ביישובים המנוטרים</div>';
    } else {
        data.settlements.forEach(s => {
            const div = document.createElement('div');
            div.className = 'settlement-item';
            div.innerHTML = `<span>${s.name}</span> <b>${s.intensity} מ"מ/שעה</b>`;
            list.appendChild(div);
        });
    }
}

window.onload = init;
