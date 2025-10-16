// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

// Mock data - in a real app, this would come from an API
const playerData = [
  {
    id: 1,
    name: "Zenon",
    country: "PL",
    team: "Gotei 13",
    rating: 91.9,
    trend: "down",
    image: "https://byt-tournaments.de/leaderboard/overlay/faces/1513490.png",
    stats: { kills: 302, assists: 45, damage: 24500, entries: 48 }
  },
  {
    id: 2,
    name: "Red",
    country: "FR",
    team: "BMS",
    rating: 89.7,
    trend: "up",
    image: "https://byt-tournaments.de/leaderboard/overlay/faces/449912.png",
    stats: { kills: 285, assists: 67, damage: 23800, entries: 42 }
  },
  {
    id: 3,
    name: "Achilles",
    country: "SE",
    team: "Drug Abusers",
    rating: 89.6,
    trend: "down",
    image: "https://byt-tournaments.de/leaderboard/overlay/faces/1556384.png",
    stats: { kills: 332, assists: 86, damage: 27958, entries: 60 }
  },
  {
    id: 4,
    name: "Wursti",
    country: "DE",
    team: "O'Block",
    rating: 89.0,
    trend: "up",
    image: "https://byt-tournaments.de/leaderboard/overlay/faces/290348.png",
    stats: { kills: 278, assists: 98, damage: 22500, entries: 38 }
  },
  {
    id: 5,
    name: "bunter_igel",
    country: "DE",
    team: "O'Block",
    rating: 88.3,
    trend: "up",
    image: "https://byt-tournaments.de/leaderboard/overlay/faces/671857.png",
    stats: { kills: 265, assists: 72, damage: 21800, entries: 35 }
  },
  {
    id: 6,
    name: "Python",
    country: "EN",
    team: "Drug Abusers",
    rating: 88.1,
    trend: "down",
    image: "https://byt-tournaments.de/leaderboard/overlay/faces/927368.png",
    stats: { kills: 290, assists: 58, damage: 23200, entries: 45 }
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
  ]
};

const App = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="animated-bg"></div>
      
      {/* Header */}
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navigation">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="nav-icon">🏆</span>
          Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          <span className="nav-icon">👥</span>
          Players
        </button>
        <button 
          className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <span className="nav-icon">📊</span>
          Statistics
        </button>
        <button 
          className={`nav-btn ${activeTab === 'leaderboards' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboards')}
        >
          <span className="nav-icon">🏅</span>
          Leaderboards
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'players' && (
          <PlayersTab 
            players={playerData}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
            getRatingColor={getRatingColor}
            getTrendIcon={getTrendIcon}
            getTrendColor={getTrendColor}
          />
        )}
        {activeTab === 'stats' && <StatsTab stats={statsData} />}
        {activeTab === 'leaderboards' && <LeaderboardsTab stats={statsData} />}
      </main>

      {/* Player Modal */}
      {selectedPlayer && (
        <PlayerModal 
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          getRatingColor={getRatingColor}
          getTrendIcon={getTrendIcon}
          getTrendColor={getTrendColor}
        />
      )}
    </div>
  );
};

const OverviewTab = () => {
  return (
    <div className="overview-tab">
      <div className="hero-section">
        <div className="hero-content">
          <h2>BYT Tournament Statistics</h2>
          <p>Real-time performance metrics and player rankings</p>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-value">150+</div>
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
        <h3>Featured Players</h3>
        <div className="players-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="featured-player-card">
              <div className="player-rank">#{i}</div>
              <div className="player-avatar"></div>
              <div className="player-name">Player {i}</div>
              <div className="player-rating">9{i}.{i}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PlayersTab = ({ players, selectedPlayer, setSelectedPlayer, getRatingColor, getTrendIcon, getTrendColor }) => {
  return (
    <div className="players-tab">
      <div className="section-header">
        <h2>Player Rankings</h2>
        <div className="filters">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">90+</button>
          <button className="filter-btn">85-89</button>
          <button className="filter-btn">80-84</button>
        </div>
      </div>

      <div className="players-grid">
        {players.map((player, index) => (
          <div 
            key={player.id}
            className="player-card"
            onClick={() => setSelectedPlayer(player)}
          >
            <div className="card-glow" style={{ background: getRatingColor(player.rating) }}></div>
            <div className="player-rank">#{index + 1}</div>
            <div className="player-image">
              <img src={player.image} alt={player.name} />
              <div 
                className="trend-indicator"
                style={{ backgroundColor: getTrendColor(player.trend) }}
              >
                {getTrendIcon(player.trend)}
              </div>
            </div>
            <div className="player-info">
              <div className="player-name">
                <span className="flag">🇵🇱</span>
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

const StatsTab = ({ stats }) => {
  return (
    <div className="stats-tab">
      <h2>Performance Statistics</h2>
      <div className="stats-grid">
        {Object.entries(stats).map(([key, data]) => (
          <div key={key} className="stat-card-large">
            <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
            <div className="stat-list">
              {data.map((item, index) => (
                <div key={index} className="stat-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="player-info">
                    <span className="flag">🇺🇸</span>
                    <span className="player-name">{item.player}</span>
                  </div>
                  <div className="stat-value">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeaderboardsTab = ({ stats }) => {
  return (
    <div className="leaderboards-tab">
      <h2>Tournament Leaderboards</h2>
      <div className="leaderboards-container">
        <div className="leaderboard-main">
          <h3>Top Performers</h3>
          <div className="top-players">
            {[1, 2, 3].map(rank => (
              <div key={rank} className={`top-player rank-${rank}`}>
                <div className="rank-badge">{rank}</div>
                <div className="player-avatar"></div>
                <div className="player-details">
                  <div className="player-name">Player {rank}</div>
                  <div className="player-stats">
                    <span>Kills: 300+</span>
                    <span>Rating: 90+</span>
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
              <div className="stat-value">Achilles - 332</div>
            </div>
            <div className="quick-stat">
              <div className="stat-title">Highest Rating</div>
              <div className="stat-value">Zenon - 91.9</div>
            </div>
            <div className="quick-stat">
              <div className="stat-title">Most Damage</div>
              <div className="stat-value">Roni - 29,180</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayerModal = ({ player, onClose, getRatingColor, getTrendIcon, getTrendColor }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="player-image-large">
            <img src={player.image} alt={player.name} />
          </div>
          <div className="player-details">
            <h2>{player.name}</h2>
            <div className="player-meta">
              <span className="team">{player.team}</span>
              <span className="country">🇵🇱 {player.country}</span>
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
          </div>
        </div>

        <div className="performance-chart">
          <h3>Performance Trend</h3>
          <div className="chart-placeholder">
            Performance chart would be displayed here
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;