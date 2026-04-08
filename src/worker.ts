interface Vessel {
  id: string;
  name: string;
  type: 'cargo' | 'tanker' | 'passenger' | 'support';
  status: 'active' | 'docked' | 'maintenance' | 'offline';
  health: number; // 0-100
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  lastUpdate: string;
}

interface FleetStatus {
  totalVessels: number;
  activeVessels: number;
  averageHealth: number;
  operationalStatus: {
    active: number;
    docked: number;
    maintenance: number;
    offline: number;
  };
  geographicDistribution: Record<string, number>;
}

interface TrafficPattern {
  timestamp: string;
  vesselCount: number;
  averageSpeed: number;
  hotspots: Array<{
    latitude: number;
    longitude: number;
    density: number;
  }>;
}

const FLEET_DATA: Vessel[] = [
  {
    id: "vs-001",
    name: "Aurora Borealis",
    type: "cargo",
    status: "active",
    health: 94,
    latitude: 35.6895,
    longitude: 139.6917,
    speed: 18.5,
    heading: 245,
    lastUpdate: new Date().toISOString()
  },
  {
    id: "vs-002",
    name: "Celestial Dawn",
    type: "tanker",
    status: "active",
    health: 87,
    latitude: 40.7128,
    longitude: -74.0060,
    speed: 14.2,
    heading: 120,
    lastUpdate: new Date().toISOString()
  },
  {
    id: "vs-003",
    name: "Neptune's Pride",
    type: "passenger",
    status: "docked",
    health: 96,
    latitude: 51.5074,
    longitude: -0.1278,
    speed: 0,
    heading: 0,
    lastUpdate: new Date().toISOString()
  },
  {
    id: "vs-004",
    name: "Abyssal Explorer",
    type: "support",
    status: "maintenance",
    health: 65,
    latitude: 1.3521,
    longitude: 103.8198,
    speed: 0,
    heading: 0,
    lastUpdate: new Date().toISOString()
  }
];

function calculateFleetStatus(vessels: Vessel[]): FleetStatus {
  const activeVessels = vessels.filter(v => v.status === "active").length;
  const totalHealth = vessels.reduce((sum, v) => sum + v.health, 0);
  
  const operationalStatus = {
    active: vessels.filter(v => v.status === "active").length,
    docked: vessels.filter(v => v.status === "docked").length,
    maintenance: vessels.filter(v => v.status === "maintenance").length,
    offline: vessels.filter(v => v.status === "offline").length
  };

  const geographicDistribution: Record<string, number> = {};
  vessels.forEach(vessel => {
    const region = getRegion(vessel.latitude, vessel.longitude);
    geographicDistribution[region] = (geographicDistribution[region] || 0) + 1;
  });

  return {
    totalVessels: vessels.length,
    activeVessels,
    averageHealth: Math.round(totalHealth / vessels.length),
    operationalStatus,
    geographicDistribution
  };
}

function getRegion(lat: number, lon: number): string {
  if (lat > 0 && lon > 0) return "NE";
  if (lat > 0 && lon < 0) return "NW";
  if (lat < 0 && lon > 0) return "SE";
  if (lat < 0 && lon < 0) return "SW";
  return "Equator";
}

function generateTrafficPatterns(vessels: Vessel[]): TrafficPattern {
  const activeVessels = vessels.filter(v => v.status === "active");
  const averageSpeed = activeVessels.length > 0 
    ? activeVessels.reduce((sum, v) => sum + v.speed, 0) / activeVessels.length 
    : 0;

  const hotspots = vessels
    .filter(v => v.status === "active")
    .map(v => ({
      latitude: v.latitude,
      longitude: v.longitude,
      density: Math.random() * 100
    }))
    .slice(0, 3);

  return {
    timestamp: new Date().toISOString(),
    vesselCount: activeVessels.length,
    averageSpeed: parseFloat(averageSpeed.toFixed(1)),
    hotspots
  };
}

function generateDashboardHTML(status: FleetStatus, vessels: Vessel[], traffic: TrafficPattern): string {
  const vesselCards = vessels.map(vessel => `
    <div class="vessel-card" data-status="${vessel.status}" data-health="${vessel.health}">
      <div class="vessel-header">
        <span class="vessel-name">${vessel.name}</span>
        <span class="vessel-type">${vessel.type}</span>
      </div>
      <div class="vessel-health">
        <div class="health-bar">
          <div class="health-fill" style="width: ${vessel.health}%"></div>
        </div>
        <span class="health-value">${vessel.health}%</span>
      </div>
      <div class="vessel-position">
        <span>📍 ${vessel.latitude.toFixed(4)}, ${vessel.longitude.toFixed(4)}</span>
      </div>
      <div class="vessel-status ${vessel.status}">
        ${vessel.status.toUpperCase()}
      </div>
    </div>
  `).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fleet Aurora Dashboard</title>
  <style>
    :root {
      --dark-bg: #0a0a0f;
      --dark-card: #151520;
      --accent: #ec4899;
      --text: #f8fafc;
      --text-secondary: #94a3b8;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --border: #2d2d42;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: var(--dark-bg);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .hero {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background: linear-gradient(135deg, #0a0a0f 0%, #151530 100%);
      border-radius: 1rem;
      border: 1px solid var(--border);
    }
    
    .hero h1 {
      font-size: 3.5rem;
      background: linear-gradient(90deg, var(--accent), #8b5cf6);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 0.5rem;
    }
    
    .hero p {
      color: var(--text-secondary);
      font-size: 1.2rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    
    .stat-card {
      background: var(--dark-card);
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid var(--border);
      transition: transform 0.2s, border-color 0.2s;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
      border-color: var(--accent);
    }
    
    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--accent);
      margin-bottom: 0.5rem;
    }
    
    .stat-label {
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .status-indicator {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 0.5rem;
    }
    
    .status-indicator.active { background: var(--success); }
    .status-indicator.docked { background: var(--warning); }
    .status-indicator.maintenance { background: var(--danger); }
    .status-indicator.offline { background: var(--text-secondary); }
    
    .fleet-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    
    .vessel-card {
      background: var(--dark-card);
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid var(--border);
      transition: all 0.3s ease;
    }
    
    .vessel-card:hover {
      border-color: var(--accent);
      box-shadow: 0 0 20px rgba(236, 72, 153, 0.1);
    }
    
    .vessel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .vessel-name {
      font-weight: bold;
      font-size: 1.2rem;
    }
    
    .vessel-type {
      background: rgba(236, 72, 153, 0.1);
      color: var(--accent);
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.8rem;
    }
    
    .health-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      margin: 0.5rem 0;
    }
    
    .health-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--success), var(--accent));
      transition: width 0.3s ease;
    }
    
    .vessel-status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.8rem;
      font-weight: bold;
      margin-top: 1rem;
    }
    
    .vessel-status.active {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }
    
    .vessel-status.docked {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }
    
    .vessel-status.maintenance {
      background: rgba(239, 68, 68, 0.1);
      color: var(--danger);
    }
    
    .vessel-status.offline {
      background: rgba(148, 163, 184, 0.1);
      color: var(--text-secondary);
    }
    
    .traffic-patterns {
      background: var(--dark-card);
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid var(--border);
      margin-bottom: 3rem;
    }
    
    .traffic-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .hotspot {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .hotspot-density {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      background: linear-gradient(135deg, var(--accent), #8b5cf6);
    }
    
    .fleet-footer {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
      border-top: 1px solid var(--border);
      margin-top: 2rem;
    }
    
    .pulse {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .hero h1 {
        font-size: 2.5rem;
      }
      
      .fleet-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <h1>Fleet Aurora</h1>
      <p>Real-time fleet visualization and monitoring dashboard</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${status.totalVessels}</div>
        <div class="stat-label">Total Vessels</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-value">${status.activeVessels}</div>
        <div class="stat-label">Active Vessels</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-value">${status.averageHealth}%</div>
        <div class="stat-label">Average Health</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-value">${traffic.averageSpeed} kn</div>
        <div class="stat-label">Avg Speed</div>
      </div>
    </div>
    
    <div class="fleet-grid">
      ${vesselCards}
    </div>
    
    <div class="traffic-patterns">
      <div class="traffic-header">
        <h2>Traffic Patterns</h2>
        <span class="pulse">🔄 Live</span>
      </div>
      
      <div class="stat-value">${traffic.vesselCount} vessels in transit</div>
      
      <div style="margin-top: 1.5rem;">
        <h3 style="margin-bottom: 1rem; color: var(--text-secondary);">Current Hotspots</h3>
        ${traffic.hotspots.map(hotspot => `
          <div class="hotspot">
            <div class="hotspot-density">${hotspot.density.toFixed(0)}%</div>
            <div>
              <div>📍 ${hotspot.latitude.toFixed(2)}, ${hotspot.longitude.toFixed(2)}</div>
              <div style="color: var(--text-secondary); font-size: 0.9rem;">High traffic density</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
    
    <div class="fleet-footer">
      <p>Fleet Aurora Dashboard • Real-time Monitoring System</p>
      <p style="margin-top: 0.5rem;">
        <a href="/health" style="color: var(--accent); text-decoration: none;">System Health</a> • 
        Last updated: ${new Date().toLocaleTimeString()}
      </p>
    </div>
  </div>
  
  <script>
    function updateData() {
      fetch('/api/status')
        .then(response => response.json())
        .then(data => {
          if (data.vessels) {
            updateVesselCards(data.vessels);
            updateStats(data.status);
          }
        })
        .catch(error => console.error('Update error:', error));
    }
    
    function updateVesselCards(vessels) {
      vessels.forEach(vessel => {
        const card = document.querySelector(\`.vessel-card[data-id="\${vessel.id}"]\`);
        if (card) {
          const healthFill = card.querySelector('.health-fill');
          const healthValue = card.querySelector('.health-value');
          const statusBadge = card.querySelector('.vessel-status');
          
          if (healthFill) healthFill.style.width = vessel.health + '%';
          if (healthValue) healthValue.textContent = vessel.health + '%';
          if (statusBadge) {
            statusBadge.className = 'vessel-status ' + vessel.status;
            statusBadge.textContent = vessel.status.toUpperCase();
          }
        }
      });
    }
    
    function updateStats(status) {
      document.querySelector('.stat-value:nth-child(1)').textContent = status.totalVessels;
      document.querySelector('.stat-value:nth-child(2)').textContent = status.activeVessels;
      document.querySelector('.stat-value:nth-child(3)').textContent = status.averageHealth + '%';
    }
    
    setInterval(updateData, 10000);
    
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.vessel-card').forEach(card => {
        card.addEventListener('click', () => {
          card.style.transform = 'scale(0.98)';
          setTimeout(() => {
            card.style.transform = 'scale(1)';
          }, 150);
        });
      });
    });
  </script>
</body>
</html>
  `;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff"
};

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  
  if (url.pathname === "/" || url.pathname === "/api/aurora") {
    const status = calculateFleetStatus(FLEET_DATA);
    const traffic = generateTrafficPatterns(FLEET_DATA);
    const html = generateDashboardHTML(status, FLEET_DATA, traffic);
    
    return new Response(html, {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        ...corsHeaders
      }
    });
  }
  
  if (url.pathname === "/api/status") {
    const status = calculateFleetStatus(FLEET_DATA);
    
    return new Response(JSON.stringify({
      status,
      vessels: FLEET_DATA,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
  
  if (url.pathname === "/api/map") {
    const mapData = {
      vessels: FLEET_DATA.map(v => ({
        id: v.id,
        name: v.name,
        coordinates: [v.latitude, v.longitude],
        status: v.status,
        heading: v.heading,
        speed: v.speed
      })),
      trafficPatterns: generateTrafficPatterns(FLEET_DATA),
      lastUpdate: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(mapData), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
  
  if (url.pathname === "/health") {
    return new Response(JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? process.uptime() : 0
    }), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
  
  return new Response("Not Found", {
    status: 404,
    headers: corsHeaders
  });
}

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});

export default {
  fetch: handleRequest
};
