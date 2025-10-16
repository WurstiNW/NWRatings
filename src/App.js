import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

// Mock data for 200+ players with GUIDs
const generatePlayerData = () => {
  const countries = ['PL', 'FR', 'SE', 'DE', 'EN', 'NL', 'IR', 'UA', 'BE', 'RU', 'SC', 'NO', 'US', 'CA', 'BR', 'ES', 'IT', 'TR'];
  const teams = ['Gotei 13', 'BMS', 'Drug Abusers', 'O\'Block', 'Team Liquid', 'Fnatic', 'Navi', 'Vitality', 'G2', 'FaZe'];
  const trends = ['up', 'down', 'same', 'new'];
  
  const players = [];
  
  // Top players with real data and GUIDs
  const topPlayers = [
    { id: 1, name: "Zenon", country: "PL", team: "Gotei 13", rating: 91.9, trend: "down", guid: "1513490" },
    { id: 2, name: "Red", country: "FR", team: "BMS", rating: 89.7, trend: "up", guid: "449912" },
    { id: 3, name: "Achilles", country: "SE", team: "Drug Abusers", rating: 89.6, trend: "down", guid: "1556384" },
    { id: 4, name: "Wursti", country: "DE", team: "O'Block", rating: 89.0, trend: "up", guid: "290348" },
    { id: 5, name: "bunter_igel", country: "DE", team: "O'Block", rating: 88.3, trend: "up", guid: "671857" },
    { id: 6, name: "Python", country: "EN", team: "Drug Abusers", rating: 88.1, trend: "down", guid: "927368" },
    { id: 7, name: "sHype", country: "NL", team: "Drug Abusers", rating: 88.0, trend: "down", guid: "1472629" },
    { id: 8, name: "Jakob", country: "DE", team: "Gotei 13", rating: 87.4, trend: "up", guid: "1123134" },
    { id: 9, name: "Gibby", country: "EN", team: "Unknown", rating: 87.1, trend: "up", guid: "1234567" },
    { id: 10, name: "TheDeaD", country: "FR", team: "Unknown", rating: 86.9, trend: "up", guid: "2345678" }
  ];

  // Add top players with detailed stats
  topPlayers.forEach((player, index) => {
    players.push({
      ...player,
      stats: { 
        kills: 300 - (index * 5) + Math.floor(Math.random() * 50),
        assists: 45 + (index * 3) + Math.floor(Math.random() * 20),
        damage: 24500 - (index * 200) + Math.floor(Math.random() * 1000),
        entries: 48 - (index * 2) + Math.floor(Math.random() * 10),
        kd: 1.3 + (Math.random() * 0.3),
        adr: 80 + (Math.random() * 10)
      },
      history: Array.from({length: 4}, (_, i) => 85 + (Math.random() * 10))
    });
  });

  // Generate remaining players with GUIDs
  for (let i = 11; i <= 200; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const team = teams[Math.floor(Math.random() * teams.length)];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    const rating = 65 + (Math.random() * 30); // Ratings between 65-95
    const guid = Math.floor(1000000 + Math.random() * 9000000).toString(); // Generate random GUID
    
    players.push({
      id: i,
      name: `Player${i}`,
      country,
      team,
      rating: parseFloat(rating.toFixed(1)),
      trend,
      guid,
      stats: { 
        kills: Math.floor(Math.random() * 300),
        assists: Math.floor(Math.random() * 100),
        damage: Math.floor(Math.random() * 30000),
        entries: Math.floor(Math.random() * 60),
        kd: 0.5 + (Math.random() * 2),
        adr: 50 + (Math.random() * 50)
      },
      history: Array.from({length: 4}, (_, i) => 60 + (Math.random() * 35))
    });
  }

  return players.sort((a, b) => b.rating - a.rating);
};

const playerData = generatePlayerData();

const statsData = {
  kills: [
    { player: "Achilles", country: "SE", value: 332 },
    { player: "sHype", country: "NL", value: 327 },
    { player: "Roni", country: "FR", value: 327 },
    { player: "Jakob", country: "DE", value: 310 },
    { player: "Zenon", country: "PL", value: 302 }
  ],
  assists: [
    { player: "Jakob", country: "DE", value: 100 },
    { player: "Wursti", country: "DE", value: 98 },
    { player: "Blitzkrieg", country: "EN", value: 88 },
    { player: "Achilles", country: "SE", value: 86 },
    { player: "sHype", country: "NL", value: 86 }
  ],
  damage: [
    { player: "Roni", country: "FR", value: 29180 },
    { player: "Achilles", country: "SE", value: 27958 },
    { player: "sHype", country: "NL", value: 27721 },
    { player: "Wolpi", country: "DE", value: 26788 },
    { player: "Jakob", country: "DE", value: 26692 }
  ],
  damageDiff: [
    { player: "Achilles", country: "SE", value: "+10,468", positive: true },
    { player: "Red", country: "FR", value: "+9,398", positive: true },
    { player: "sHype", country: "NL", value: "+9,212", positive: true },
    { player: "Zenon", country: "PL", value: "+9,204", positive: true },
    { player: "Wursti", country: "DE", value: "+7,465", positive: true }
  ],
  kdDiff: [
    { player: "Achilles", country: "SE", value: "+134", positive: true },
    { player: "Zenon", country: "PL", value: "+132", positive: true },
    { player: "sHype", country: "NL", value: "+117", positive: true },
    { player: "Red", country: "FR", value: "+115", positive: true },
    { player: "Wursti", country: "DE", value: "+92", positive: true }
  ]
};

// Utility functions
const getRatingColor = (rating) => {
  if (rating >= 90) return '#b8860b'; // Gold for elite
  if (rating >= 85) return '#daa520'; // Goldenrod for excellent
  if (rating >= 80) return '#cd853f'; // Peru for very good
  if (rating >= 75) return '#d2b48c'; // Tan for good
  if (rating >= 70) return '#bcb8a3'; // Silver for average
  return '#a9a9a9'; // Dark gray for below average
};

// Use actual BYT tournament trend icons
const getTrendIcon = (trend) => {
  const iconBaseUrl = 'https://byt-tournaments.de/matches/icons';
  
  switch(trend) {
    case "up": 
      return `${iconBaseUrl}/up.png`;
    case "down": 
      return `${iconBaseUrl}/down.png`;
    case "same": 
      return `${iconBaseUrl}/same.png`;
    case "new": 
      return `${iconBaseUrl}/new.png`;
    default: 
      return `${iconBaseUrl}/same.png`;
  }
};

const getTrendColor = (trend) => {
  switch(trend) {
    case "up": return "#22c55e"; // Green
    case "down": return "#ef4444"; // Red
    case "same": return "#6b7280"; // Gray
    case "new": return "#eab308"; // Yellow
    default: return "#6b7280";
  }
};

const getFlagUrl = (countryCode) => {
  return `https://fantasy.byt-tournaments.de/flags_lb/${countryCode}.png`;
};

const getPlayerImage = (player) => {
  if (player.guid) {
    return `https://byt-tournaments.de/leaderboard/overlay/faces/${player.guid}.png`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=8b7355&color=fff&size=128&bold=true`;
};

// Header Component
const Header = ({ searchTerm, onSearchChange }) => {
  return (
    <header className="header">
      <div className="header-content">
        <img 
          src="https://i.postimg.cc/hJFCTgpz/byt.png" 
          alt="BYT Tournaments" 
          className="logo"
        />
        <h1 className="title">Tournament Statistics Dashboard</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>
    </header>
  );
};

// Navigation Component
const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏆' },
    { id: 'players', label: 'Players', icon: '👥' },
    { id: 'stats', label: 'Statistics', icon: '📊' }
  ];

  return (
    <nav className="navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

// Overview Tab Component
const OverviewTab = ({ players, stats }) => {
  const topPlayers = players.slice(0, 3);
  
  return (
    <div className="overview-tab">
      <div className="hero-section">
        <div className="hero-content">
          <h2>BYT Tournament Statistics</h2>
          <p>Real-time performance metrics and player rankings</p>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-value">{players.length}+</div>
              <div className="stat-label">Players</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">45+</div>
              <div className="stat-label">Rounds Played</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">3</div>
              <div className="stat-label">Tournaments</div>
            </div>
          </div>
        </div>
      </div>

      <div className="top-performers">
        <h3>Top Performers</h3>
        <div className="top-players">
          {topPlayers.map((player, index) => (
            <div key={player.id} className={`top-player rank-${index + 1}`}>
              <div className="rank-badge">{index + 1}</div>
              <div className="player-avatar">
                <img 
                  src={getPlayerImage(player)} 
                  alt={player.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-fallback" style={{ display: 'none' }}>
                  👤
                </div>
              </div>
              <div className="player-details">
                <div className="player-name">
                  <img 
                    src={getFlagUrl(player.country)} 
                    alt={player.country}
                    className="flag"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallbackSpan = document.createElement('span');
                      fallbackSpan.className = 'flag-fallback';
                      fallbackSpan.textContent = player.country;
                      e.target.parentNode.appendChild(fallbackSpan);
                    }}
                  />
                  {player.name}
                </div>
                <div className="player-stats">
                  <span>Kills: {player.stats.kills}</span>
                  <span>Rating: {player.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-stats-section">
        <h3>Quick Stats</h3>
        <div className="quick-stats-grid">
          <div className="quick-stat">
            <div className="stat-title">Most Kills</div>
            <div className="stat-value">{stats.kills[0].player} - {stats.kills[0].value}</div>
          </div>
          <div className="quick-stat">
            <div className="stat-title">Highest Rating</div>
            <div className="stat-value">Zenon - 91.9</div>
          </div>
          <div className="quick-stat">
            <div className="stat-title">Most Damage</div>
            <div className="stat-value">{stats.damage[0].player} - {stats.damage[0].value}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Players Tab Component
const PlayersTab = ({ players, onPlayerSelect }) => {
  const [ratingFilter, setRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 20;

  const filteredPlayers = useMemo(() => {
    let filtered = players;
    
    if (ratingFilter !== 'all') {
      if (ratingFilter === '90+') filtered = filtered.filter(p => p.rating >= 90);
      else if (ratingFilter === '85-89') filtered = filtered.filter(p => p.rating >= 85 && p.rating < 90);
      else if (ratingFilter === '80-84') filtered = filtered.filter(p => p.rating >= 80 && p.rating < 85);
      else if (ratingFilter === '75-79') filtered = filtered.filter(p => p.rating >= 75 && p.rating < 80);
      else if (ratingFilter === '70-74') filtered = filtered.filter(p => p.rating >= 70 && p.rating < 75);
      else if (ratingFilter === '65-69') filtered = filtered.filter(p => p.rating >= 65 && p.rating < 70);
    }
    
    return filtered;
  }, [players, ratingFilter]);

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  const startIndex = (currentPage - 1) * playersPerPage;
  const currentPlayers = filteredPlayers.slice(startIndex, startIndex + playersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [ratingFilter]);

  return (
    <div className="players-tab">
      <div className="section-header">
        <h2>Player Rankings ({filteredPlayers.length} players)</h2>
        <div className="filters">
          <button className={`filter-btn ${ratingFilter === 'all' ? 'active' : ''}`} onClick={() => setRatingFilter('all')}>
            All
          </button>
          <button className={`filter-btn ${ratingFilter === '90+' ? 'active' : ''}`} onClick={() => setRatingFilter('90+')}>
            90+
          </button>
          <button className={`filter-btn ${ratingFilter === '85-89' ? 'active' : ''}`} onClick={() => setRatingFilter('85-89')}>
            85-89
          </button>
          <button className={`filter-btn ${ratingFilter === '80-84' ? 'active' : ''}`} onClick={() => setRatingFilter('80-84')}>
            80-84
          </button>
          <button className={`filter-btn ${ratingFilter === '75-79' ? 'active' : ''}`} onClick={() => setRatingFilter('75-79')}>
            75-79
          </button>
          <button className={`filter-btn ${ratingFilter === '70-74' ? 'active' : ''}`} onClick={() => setRatingFilter('70-74')}>
            70-74
          </button>
          <button className={`filter-btn ${ratingFilter === '65-69' ? 'active' : ''}`} onClick={() => setRatingFilter('65-69')}>
            65-69
          </button>
        </div>
      </div>

      <div className="players-grid">
        {currentPlayers.map((player, index) => (
          <div 
            key={player.id}
            className="player-card"
            onClick={() => onPlayerSelect(player)}
          >
            <div className="card-glow" style={{ background: getRatingColor(player.rating) }}></div>
            <div className="player-rank">#{startIndex + index + 1}</div>
            <div className="player-image">
              <img 
                src={getPlayerImage(player)} 
                alt={player.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="image-fallback" style={{ display: 'none' }}>
                👤
              </div>
              <div className="trend-indicator">
                <img 
                  src={getTrendIcon(player.trend)} 
                  alt={player.trend}
                  className="trend-icon"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallbackText = document.createElement('div');
                    fallbackText.className = 'trend-fallback';
                    fallbackText.textContent = 
                      player.trend === 'up' ? '↑' : 
                      player.trend === 'down' ? '↓' : 
                      player.trend === 'new' ? '⭐' : '→';
                    fallbackText.style.color = getTrendColor(player.trend);
                    fallbackText.style.fontSize = '10px';
                    fallbackText.style.fontWeight = 'bold';
                    e.target.parentNode.appendChild(fallbackText);
                  }}
                />
              </div>
            </div>
            <div className="player-info">
              <div className="player-name">
                <img 
                  src={getFlagUrl(player.country)} 
                  alt={player.country}
                  className="flag"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallbackSpan = document.createElement('span');
                    fallbackSpan.className = 'flag-fallback';
                    fallbackSpan.textContent = player.country;
                    e.target.parentNode.appendChild(fallbackSpan);
                  }}
                />
                {player.name}
              </div>
              <div className="player-team">{player.team}</div>
              <div 
                className="player-rating"
                style={{ color: getRatingColor(player.rating) }}
              >
                {player.rating}
              </div>
            </div>
            <div className="player-stats-preview">
              <div className="stat">
                <span className="stat-value">{player.stats.kills}</span>
                <span className="stat-label">Kills</span>
              </div>
              <div className="stat">
                <span className="stat-value">{player.stats.assists}</span>
                <span className="stat-label">Assists</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>
          
          <button 
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Stats Tab Component
const StatsTab = ({ stats }) => {
  return (
    <div className="stats-tab">
      <h2>Performance Statistics</h2>
      <div className="stats-grid">
        {Object.entries(stats).map(([key, data]) => (
          <div key={key} className="stat-card-large">
            <h3>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</h3>
            <div className="stat-list">
              {data.map((item, index) => (
                <div key={index} className="stat-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="player-info">
                    <img 
                      src={getFlagUrl(item.country)} 
                      alt={item.country}
                      className="flag"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallbackSpan = document.createElement('span');
                        fallbackSpan.className = 'flag-fallback';
                        fallbackSpan.textContent = item.country;
                        e.target.parentNode.appendChild(fallbackSpan);
                      }}
                    />
                    <span className="player-name">{item.player}</span>
                  </div>
                  <div className={`stat-value ${item.positive ? 'positive' : ''}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Player Modal Component
const PlayerModal = ({ player, onClose }) => {
  if (!player) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="player-image-large">
            <img 
              src={getPlayerImage(player)} 
              alt={player.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="image-fallback" style={{ display: 'none' }}>
              👤
            </div>
          </div>
          <div className="player-details">
            <h2>{player.name}</h2>
            <div className="player-meta">
              <span className="team">{player.team}</span>
              <span className="country">
                <img 
                  src={getFlagUrl(player.country)} 
                  alt={player.country}
                  className="flag"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallbackSpan = document.createElement('span');
                    fallbackSpan.className = 'flag-fallback';
                    fallbackSpan.textContent = player.country;
                    e.target.parentNode.appendChild(fallbackSpan);
                  }}
                />
                {player.country}
              </span>
            </div>
            <div 
              className="player-rating-large"
              style={{ color: getRatingColor(player.rating) }}
            >
              {player.rating}
              <div className="trend-large">
                <img 
                  src={getTrendIcon(player.trend)} 
                  alt={player.trend}
                  className="trend-icon-large"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallbackText = document.createElement('div');
                    fallbackText.className = 'trend-fallback-large';
                    fallbackText.textContent = 
                      player.trend === 'up' ? '↑' : 
                      player.trend === 'down' ? '↓' : 
                      player.trend === 'new' ? '⭐' : '→';
                    fallbackText.style.color = getTrendColor(player.trend);
                    fallbackText.style.fontSize = '20px';
                    fallbackText.style.fontWeight = 'bold';
                    e.target.parentNode.appendChild(fallbackText);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-stats">
          <div className="stat-grid">
            <div className="stat-item-modal">
              <div className="stat-value">{player.stats.kills}</div>
              <div className="stat-label">Kills</div>
            </div>
            <div className="stat-item-modal">
              <div className="stat-value">{player.stats.assists}</div>
              <div className="stat-label">Assists</div>
            </div>
            <div className="stat-item-modal">
              <div className="stat-value">{player.stats.damage}</div>
              <div className="stat-label">Damage</div>
            </div>
            <div className="stat-item-modal">
              <div className="stat-value">{player.stats.entries}</div>
              <div className="stat-label">Entries</div>
            </div>
            <div className="stat-item-modal">
              <div className="stat-value">{player.stats.kd.toFixed(2)}</div>
              <div className="stat-label">K/D Ratio</div>
            </div>
            <div className="stat-item-modal">
              <div className="stat-value">{player.stats.adr.toFixed(1)}</div>
              <div className="stat-label">ADR</div>
            </div>
          </div>
        </div>

        <div className="performance-chart">
          <h3>Rating History</h3>
          <div className="chart-placeholder">
            <div className="chart-bars">
              {player.history.map((rating, index) => (
                <div key={index} className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ 
                      height: `${(rating - 60) * 2}px`,
                      background: getRatingColor(rating)
                    }}
                  ></div>
                  <div className="chart-label">{rating.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; 2024 BYT Tournaments. All statistics based on tournament data.</p>
        <div className="footer-links">
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredPlayers = useMemo(() => {
    return playerData.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <h2>Loading Tournament Data...</h2>
          <p>Preparing your dashboard experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="animated-bg"></div>
      
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <Navigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="main-content">
        {activeTab === 'overview' && <OverviewTab players={playerData} stats={statsData} />}
        {activeTab === 'players' && (
          <PlayersTab 
            players={filteredPlayers}
            onPlayerSelect={setSelectedPlayer}
          />
        )}
        {activeTab === 'stats' && <StatsTab stats={statsData} />}
      </main>

      {selectedPlayer && (
        <PlayerModal 
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default App;
