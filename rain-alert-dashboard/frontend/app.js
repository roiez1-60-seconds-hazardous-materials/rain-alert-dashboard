/**
 * Rain Alert Dashboard - Main JavaScript
 * מערכת התראות גשם בזמן אמת
 */

// Configuration
const CONFIG = {
    UPDATE_INTERVAL: 10 * 60 * 1000, // 10 minutes in milliseconds
    API_ENDPOINT: '/api/radar-data',
    MAP_CENTER: [31.5, 34.75], // Israel center
    MAP_ZOOM: 8
};

// Global State
let map = null;
let currentSource = 'govmap';
let currentFilter = 'all';
let radarData = null;
let settlementsData = [];

/**
 * Initialize the dashboard
 */
async function init() {
    console.log('🚀 Initializing Rain Alert Dashboard...');
    
    // Initialize map
    initializeMap();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load Israeli settlements data
    await loadSettlementsData();
    
    // Initial data fetch
    await fetchRadarData();
    
    // Setup auto-refresh
    setInterval(fetchRadarData, CONFIG.UPDATE_INTERVAL);
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
    }, 1500);
    
    console.log('✅ Dashboard initialized successfully');
}

/**
 * Initialize Leaflet map
 */
function initializeMap() {
    map = L.map('radarMap').setView(CONFIG.MAP_CENTER, CONFIG.MAP_ZOOM);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Add custom styling
    map.zoomControl.setPosition('bottomright');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Source selector buttons
    document.querySelectorAll('.source-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.source-btn').forEach(b => b.classList.remove('active'));
            e.target.closest('.source-btn').classList.add('active');
            currentSource = e.target.closest('.source-btn').dataset.source;
            updateSourceDisplay();
        });
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.level;
            renderSettlementsList();
        });
    });
    
    // Refresh button
    document.getElementById('refreshBtn')?.addEventListener('click', fetchRadarData);
    
    // Fullscreen button
    document.getElementById('fullscreenBtn')?.addEventListener('click', toggleFullscreen);
}

/**
 * Load Israeli settlements data
 * Using mock data for now - in production, load from GeoJSON file
 */
async function loadSettlementsData() {
    try {
        const response = await fetch('settlements.json');
        if (!response.ok) throw new Error('הקובץ לא נמצא');
        settlementsData = await response.json();
        console.log(`✅ המערכת מנטרת כעת ${settlementsData.length} יישובים`);
    } catch (error) {
        console.error('שגיאה:', error);
        // רשימת חירום אם הקובץ נמחק
        settlementsData = [{ name: "תל אביב", lat: 32.0853, lng: 34.7818 }];
    }
}

/**
 * Fetch radar data from backend
 */
async function fetchRadarData() {
    console.log('🔄 Fetching radar data...');
    
    try {
        // For now, simulate data - in production, fetch from actual backend
        radarData = simulateRadarData();
        
        // Update dashboard
        updateDashboard();
        updateLastUpdateTime();
        
        console.log('✅ Radar data updated');
    } catch (error) {
        console.error('❌ Error fetching radar data:', error);
        showError('שגיאה בטעינת נתונים');
    }
}

/**
 * Simulate radar data (for development)
 */
function simulateRadarData() {
    const severityLevels = ['none', 'warning', 'danger', 'severe'];
    const affectedSettlements = settlementsData.map(settlement => ({
        ...settlement,
        severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
        intensity: Math.random() * 20,
        dbz: 20 + Math.random() * 30
    })).filter(s => s.severity !== 'none');
    
    return {
        timestamp: new Date().toISOString(),
        source: currentSource,
        coverage: Math.random() * 30,
        settlements: affectedSettlements,
        alerts: {
            warning: affectedSettlements.filter(s => s.severity === 'warning').length,
            danger: affectedSettlements.filter(s => s.severity === 'danger').length,
            severe: affectedSettlements.filter(s => s.severity === 'severe').length
        }
    };
}

/**
 * Update the entire dashboard
 */
function updateDashboard() {
    if (!radarData) return;
    
    // Update conditions
    updateConditions();
    
    // Update map
    updateMap();
    
    // Update settlements list
    renderSettlementsList();
    
    // Update alert banner
    updateAlertBanner();
}

/**
 * Update conditions card
 */
function updateConditions() {
    document.getElementById('yellowCount').textContent = radarData.alerts.warning;
    document.getElementById('orangeCount').textContent = radarData.alerts.danger;
    document.getElementById('redCount').textContent = radarData.alerts.severe;
    
    const coveragePercent = Math.round(radarData.coverage);
    document.getElementById('coverageFill').style.width = `${coveragePercent}%`;
    document.getElementById('coveragePercent').textContent = `${coveragePercent}%`;
}

/**
 * Update map with radar data
 */
function updateMap() {
    // Clear existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    
    // Add markers for affected settlements
    radarData.settlements.forEach(settlement => {
        const color = getSeverityColor(settlement.severity);
        const icon = L.divIcon({
            className: 'settlement-marker',
            html: `<div style="background: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`
        });
        
        const marker = L.marker([settlement.lat, settlement.lng], { icon })
            .addTo(map)
            .bindPopup(`
                <div style="text-align: center; font-family: Assistant, sans-serif;">
                    <strong style="font-size: 1.1rem;">${settlement.name}</strong><br>
                    <span style="color: #64748B;">עוצמה: ${settlement.intensity.toFixed(1)} מ"מ/שעה</span><br>
                    <span style="color: #64748B;">dBZ: ${settlement.dbz.toFixed(1)}</span>
                </div>
            `);
    });
}

/**
 * Render settlements list
 */
function renderSettlementsList() {
    const container = document.getElementById('settlementsList');
    if (!container || !radarData) return;
    
    let filtered = radarData.settlements;
    
    // Apply filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(s => s.severity === currentFilter);
    }
    
    // Sort by intensity
    filtered.sort((a, b) => b.intensity - a.intensity);
    
    // Render
    if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #94A3B8;">אין יישובים מושפעים</div>';
        return;
    }
    
    container.innerHTML = filtered.map(settlement => `
        <div class="settlement-item ${settlement.severity}">
            <div class="settlement-name">${settlement.name}</div>
            <div class="settlement-intensity">
                <span>${settlement.intensity.toFixed(1)} מ"מ/שעה</span>
                <span style="color: ${getSeverityColor(settlement.severity)};">●</span>
            </div>
        </div>
    `).join('');
}

/**
 * Update alert banner
 */
function updateAlertBanner() {
    const banner = document.getElementById('alertBanner');
    const hasSevere = radarData.alerts.severe > 0;
    const hasDanger = radarData.alerts.danger > 0;
    
    if (hasSevere || hasDanger) {
        const title = hasSevere ? 'התראת גשם חמור!' : 'התראת גשם כבד';
        const details = `${radarData.alerts.severe + radarData.alerts.danger} יישובים מושפעים`;
        
        document.getElementById('alertTitle').textContent = title;
        document.getElementById('alertDetails').textContent = details;
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}

/**
 * Update source display
 */
function updateSourceDisplay() {
    const sourceElement = document.getElementById('currentSource');
    if (currentSource === 'govmap') {
        sourceElement.innerHTML = '<span class="badge-icon">🇮🇱</span><span class="badge-text">GovMap</span>';
    } else {
        sourceElement.innerHTML = '<span class="badge-icon">🌐</span><span class="badge-text">Windy</span>';
    }
    
    // Refresh data
    fetchRadarData();
}

/**
 * Update last update time
 */
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('he-IL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    document.getElementById('lastUpdate').textContent = `עדכון אחרון: ${timeString}`;
    document.getElementById('sourceTime').textContent = timeString;
}

/**
 * Get severity color
 */
function getSeverityColor(severity) {
    const colors = {
        'warning': '#FFD700',
        'danger': '#FF8C00',
        'severe': '#DC143C'
    };
    return colors[severity] || '#94A3B8';
}

/**
 * Toggle fullscreen
 */
function toggleFullscreen() {
    const mapElement = document.getElementById('radarMap');
    if (!document.fullscreenElement) {
        mapElement.requestFullscreen().catch(err => {
            console.error('Error entering fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

/**
 * Show error message
 */
function showError(message) {
    const banner = document.getElementById('alertBanner');
    document.getElementById('alertTitle').textContent = 'שגיאה';
    document.getElementById('alertDetails').textContent = message;
    banner.style.display = 'block';
    banner.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
    
    setTimeout(() => {
        banner.style.display = 'none';
    }, 5000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
