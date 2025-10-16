import React, { useState, useEffect } from 'react';
import './App.css';

// Mock data
const playerData = [
  {
    id: 1,
    name: "Zenon",
    country: "PL",
    team: "Gotei 13",
    rating: 91.9,
    trend: "down",
    image: "https://byt-tournaments.de/leaderboard/overlay/faces/1513490.png",
    stats: { kills: 302, assists: 45, damage: 24500, entries: 48, kd: 1.32, adr: 85.4 },
    history: [89.2, 90.5, 91.2, 91.9]
  },
  {
    id: 2,
    name: "Red",
    country: "FR",
    team: "BMS",
    rating: 89.7,
    trend: "up",
    image: "https://byt-tournaments.de/leaderboard/overlay/faces/449912.png",
    stats: { kills: 285, assists: 67, damage: 23800, entries: 42, kd: 1.28, adr: 87.6 },
    history: [87.2, 88.5, 89.0, 89.7]
  },
  {
    id: 3,
    name: "Achilles",
    country: "SE",
    team: "Drug Abusers",
    rating: 89.6,
    trend: "down",
    image: "https://byt-tournaments.de/leaderboard/overlay/faces/1556384.png",
    stats: { kills: 332, assists: 86, damage: 27958, entries: 60, kd: 1.45, adr: 82.1 },
    history: [90.2, 89.8, 90.1, 89.6]
  },
  {
    id: 4,
    name: "Wursti",
    country: "DE",
    team: "O'Block",
    rating: 89.0,
    trend: "up",
    image: "https://byt-tournaments.de/leaderboard/overlay/faces/290348.png",
    stats: { kills: 278, assists: 98, damage: 22500, entries: 38, kd: 1.25, adr: 79.8 },
    history: [86.5, 87.2, 88.1, 89.0]
  },
  {
    id: 5,
    name: "bunter_igel",
    country: "DE",
    team: "O'Block",
    rating: 88.3,
    trend: "up",
    image: "https://byt-tournaments.de/leaderboard/overlay/faces/671857.png",
    stats: { kills: 265, assists: 72, damage: 21800, entries: 35, kd: 1.22, adr: 78.3 },
    history: [85.8, 86.5, 87.4, 88.3]
  },
  {
    id: 6,
    name: "Python",
    country: "EN",
    team: "Drug Abusers",
    rating: 88.1,
    trend: "down",
    image: "https://byt-tournaments.de/leaderboard/overlay/faces/927368.png",
    stats: { kills: 290, assists: 58, damage: 23200, entries: 45, kd: 1.30, adr: 81.5 },
    history: [89.0, 88.7, 88.9, 88.1]
  }
];

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
  if (rating >= 90) return '#7f00ff';
  if (rating >= 85) return '#0096ff';
  if (rating >= 80) return '#4CAF50';
  if (rating >= 75) return '#ffa500';
  return '#f44336';
};

const getTrendIcon = (trend) => {
  switch(trend) {
    case "up": return "↗";
    case "down": return "↘";
    case "same": return "→";
    case "new": return "⭐";
    default: return "";
  }
};

const getTrendColor = (trend) => {
  switch(trend) {
    case "up": return "#4CAF50";
    case "down": return "#f44336";
    case "same": return "#666";
    case "new": return "#FFD700";
    default: return "#666";
  }
};

const getFlagEmoji = (countryCode) => {
  const flagEmojis = {
    'PL': '🇵🇱', 'FR': '🇫🇷', 'SE': '🇸🇪', 'DE': '🇩🇪', 
    'EN': '🏴', 'NL': '🇳🇱', 'IR': '🇮🇷', 'UA': '🇺🇦',
    'BE': '🇧🇪', 'RU': '🇷🇺', 'SC': '🏴', 'NO': '🇳🇴'
  };
  return flagEmojis[countryCode] || '🏳️';
};

const getPlayerImage = (player) => {
  if (player.image && player.image.includes('byt-tournaments.de')) {
    return player.image;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=7f00ff&color=fff&size=128&bold=true`;
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
    { id: 'stats', label: 'Statistics', icon: '📊' },
    { id: 'leaderboards', label: 'Leaderboards', icon: '🏅' }
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

      <div className="featured-players">
        <h3>Top Rated Players</h3>
        <div className="players-grid">
          {players.slice(0, 6).map((player, index) => (
            <div key={player.id} className="featured-player-card">
              <div className="player-rank">#{index + 1}</div>
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
              <div className="player-name">{player.name}</div>
              <div 
                className="player-rating"
                style={{ color: getRatingColor(player.rating) }}
              >
                {player.rating}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Players Tab Component
const PlayersTab = ({ players, onPlayerSelect }) => {
  const [ratingFilter, setRatingFilter] = useState('all');

  const filteredPlayers = players.filter(player => {
    if (ratingFilter === 'all') return true;
    if (ratingFilter === '90+') return player.rating >= 90;
    if (ratingFilter === '85-89') return player.rating >= 85 && player.rating < 90;
    if (ratingFilter === '80-84') return player.rating >= 80 && player.rating < 85;
    return true;
  });

  return (
    <div className="players-tab">
      <div className="section-header">
        <h2>Player Rankings</h2>
        <div className="filters">
          <button 
            className={`filter-btn ${ratingFilter === 'all' ? 'active' : ''}`}
            onClick={() => setRatingFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${ratingFilter === '90+' ? 'active' : ''}`}
            onClick={() => setRatingFilter('90+')}
          >
            90+
          </button>
          <button 
            className={`filter-btn ${ratingFilter === '85-89' ? 'active' : ''}`}
            onClick={() => setRatingFilter('85-89')}
          >
            85-89
          </button>
          <button 
            className={`filter-btn ${ratingFilter === '80-84' ? 'active' : ''}`}
            onClick={() => setRatingFilter('80-84')}
          >
            80-84
          </button>
        </div>
      </div>

      <div className="players-grid">
        {filteredPlayers.map((player, index) => (
          <div 
            key={player.id}
            className="player-card"
            onClick={() => onPlayerSelect(player)}
          >
            <div className="card-glow" style={{ background: getRatingColor(player.rating) }}></div>
            <div className="player-rank">#{index + 1}</div>
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
              <div 
                className="trend-indicator"
                style={{ backgroundColor: getTrendColor(player.trend) }}
              >
                {getTrendIcon(player.trend)}
              </div>
            </div>
            <div className="player-info">
              <div className="player-name">
                <span className="flag">{getFlagEmoji(player.country)}</span>
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
                    <span className="flag">{getFlagEmoji(item.country)}</span>
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

// Leaderboards Tab Component
const LeaderboardsTab = ({ stats, players }) => {
  const topPlayers = players.slice(0, 3);
  
  return (
    <div className="leaderboards-tab">
      <h2>Tournament Leaderboards</h2>
      <div className="leaderboards-container">
        <div className="leaderboard-main">
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
                  <div className="player-name">{player.name}</div>
                  <div className="player-stats">
                    <span>Kills: {player.stats.kills}</span>
                    <span>Rating: {player.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="leaderboard-side">
          <h3>Quick Stats</h3>
          <div className="quick-stats">
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
              <span className="country">{getFlagEmoji(player.country)} {player.country}</span>
            </div>
            <div 
              className="player-rating-large"
              style={{ color: getRatingColor(player.rating) }}
            >
              {player.rating}
              <span 
                className="trend-large"
                style={{ color: getTrendColor(player.trend) }}
              >
                {getTrendIcon(player.trend)}
              </span>
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
              <div className="stat-value">{player.stats.kd}</div>
              <div className="stat-label">K/D Ratio</div>
            </div>
            <div className="stat-item-modal">
              <div className="stat-value">{player.stats.adr}</div>
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
                      height: `${(rating - 80) * 5}px`,
                      background: getRatingColor(rating)
                    }}
                  ></div>
                  <div className="chart-label">{rating}</div>
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

  const filteredPlayers = playerData.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {activeTab === 'leaderboards' && <LeaderboardsTab stats={statsData} players={playerData} />}
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
