import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const playerData = [
  {
    id: 1,
    name: "Zenon",
    country: "PL", 
    team: "Gotei 13",
    rating: 91.9,
    trend: "down", // "up", "down", "same", or "new"
    guid: "1513490",
    stats: {
      kills: 315,
      assists: 45,
      damage: 25480,
      entries: 48,
      kd: 1.32,
      adr: 85.4
    },
    history: [89.2, 90.5, 91.2, 91.9] // Last 4 ratings (oldest to newest)
  },
  {
    id: 2,
    name: "Red",
    country: "FR",
    team: "BMS", 
    rating: 89.7,
    trend: "up",
    guid: "449912",
    stats: {
      kills: 298,
      assists: 52,
      damage: 24230,
      entries: 46,
      kd: 1.28,
      adr: 82.1
    },
    history: [87.5, 88.3, 89.1, 89.7]
  },
  {
    id: 3,
    name: "Achilles",
    country: "SE",
    team: "Drug Abusers",
    rating: 89.6,
    trend: "down",
    guid: "1556384",
    stats: {
      kills: 302,
      assists: 48,
      damage: 24890,
      entries: 47,
      kd: 1.30,
      adr: 83.5
    },
    history: [88.0, 88.9, 89.3, 89.6]
  },
  // Add more players here following the same format...
];

const statsData = {
  kills: [
    { player: "Zenon", country: "PL", value: 315 },
    { player: "Achilles", country: "SE", value: 302 },
    { player: "Red", country: "FR", value: 298 },
    { player: "sHype", country: "NL", value: 285 },
    { player: "Wursti", country: "DE", value: 279 }
  ],
  assists: [
    { player: "Jakob", country: "DE", value: 68 },
    { player: "bunter_igel", country: "DE", value: 62 },
    { player: "Wursti", country: "DE", value: 58 },
    { player: "Python", country: "EN", value: 55 },
    { player: "Gibby", country: "EN", value: 53 }
  ],
  damage: [
    { player: "Zenon", country: "PL", value: 25480 },
    { player: "Achilles", country: "SE", value: 24890 },
    { player: "Red", country: "FR", value: 24230 },
    { player: "sHype", country: "NL", value: 23850 },
    { player: "Wursti", country: "DE", value: 23410 }
  ],
  damageDiff: [
    { player: "Zenon", country: "PL", value: "+10,468", positive: true },
    { player: "Achilles", country: "SE", value: "+9,872", positive: true },
    { player: "Red", country: "FR", value: "+9,398", positive: true },
    { player: "sHype", country: "NL", value: "+8,945", positive: true },
    { player: "Wursti", country: "DE", value: "+8,210", positive: true }
  ],
  kdDiff: [
    { player: "Zenon", country: "PL", value: "+134", positive: true },
    { player: "Achilles", country: "SE", value: "+128", positive: true },
    { player: "Red", country: "FR", value: "+121", positive: true },
    { player: "sHype", country: "NL", value: "+115", positive: true },
    { player: "Wursti", country: "DE", value: "+108", positive: true }
  ]
};

// ============================================================================
// UTILITY FUNCTIONS 
// ============================================================================

const getRatingColor = (rating) => {
  if (rating >= 90) return '#b8860b';
  if (rating >= 85) return '#daa520';
  if (rating >= 80) return '#cd853f';
  if (rating >= 75) return '#d2b48c';
  if (rating >= 70) return '#bcb8a3';
  return '#a9a9a9';
};

const getTrendIcon = (trend) => {
  const iconBaseUrl = 'https://byt-tournaments.de/matches/icons';
  switch(trend) {
    case "up": return `${iconBaseUrl}/up.png`;
    case "down": return `${iconBaseUrl}/down.png`;
    case "same": return `${iconBaseUrl}/same.png`;
    case "new": return `${iconBaseUrl}/new.png`;
    default: return `${iconBaseUrl}/same.png`;
  }
};

const getTrendColor = (trend) => {
  switch(trend) {
    case "up": return "#22c55e";
    case "down": return "#ef4444";
    case "same": return "#6b7280";
    case "new": return "#eab308";
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

// ============================================================================
// COMPONENTS - No need to modify these
// ============================================================================

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
              <div className="stat-value">{players.length}</div>
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
            <div className="stat-value">{players[0].name} - {players[0].rating}</div>
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

const StatsTab = ({ stats, players }) => {
  const topPlayers = players.slice(0, 5);
  
  const averageRating = (players.reduce((sum, player) => sum + player.rating, 0) / players.length).toFixed(1);
  const playersAbove85 = players.filter(player => player.rating >= 85).length;
  const totalKills = players.reduce((sum, player) => sum + player.stats.kills, 0);
  const totalDamage = players.reduce((sum, player) => sum + player.stats.damage, 0);

  const statIcons = {
    kills: '🎯',
    assists: '🤝',
    damage: '💥',
    damageDiff: '📊',
    kdDiff: '⚡'
  };

  return (
    <div className="stats-tab">
      <h2>Performance Statistics</h2>
      
      <div className="stats-overview">
        <div className="overview-card">
          <div className="overview-value">{players.length}</div>
          <div className="overview-label">Total Players</div>
        </div>
        <div className="overview-card">
          <div className="overview-value">{averageRating}</div>
          <div className="overview-label">Avg Rating</div>
        </div>
        <div className="overview-card">
          <div className="overview-value">{playersAbove85}</div>
          <div className="overview-label">85+ Rating</div>
        </div>
        <div className="overview-card">
          <div className="overview-value">{(totalKills / 1000).toFixed(1)}K</div>
          <div className="overview-label">Total Kills</div>
        </div>
      </div>

      <div className="stats-grid-compact">
        {Object.entries(stats).map(([key, data]) => (
          <div key={key} className="stat-card-compact">
            <div className="stat-card-header">
              <div className="stat-card-title">
                <span className="stat-card-icon">{statIcons[key]}</span>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </div>
              <div className="stat-card-count">Top {data.length}</div>
            </div>
            <div className="stat-list-compact">
              {data.map((item, index) => (
                <div key={index} className="stat-item-compact">
                  <div className="rank-compact">#{index + 1}</div>
                  <div className="player-info-compact">
                    <img 
                      src={getFlagUrl(item.country)} 
                      alt={item.country}
                      className="flag-compact"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallbackSpan = document.createElement('span');
                        fallbackSpan.className = 'flag-fallback';
                        fallbackSpan.textContent = item.country;
                        fallbackSpan.style.fontSize = '10px';
                        e.target.parentNode.appendChild(fallbackSpan);
                      }}
                    />
                    <span className="player-name-compact">{item.player}</span>
                  </div>
                  <div className={`stat-value-compact ${item.positive ? 'positive' : ''}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="performance-metrics">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Top Player Distribution</div>
            <div className="metric-trend">
              <span>↑</span>
              <span>Balanced</span>
            </div>
          </div>
          <div className="metric-bar">
            <div className="metric-fill" style={{ width: '85%' }}></div>
          </div>
          <div className="metric-stats">
            <span>90+ Rating: {players.filter(p => p.rating >= 90).length}</span>
            <span>85-89: {players.filter(p => p.rating >= 85 && p.rating < 90).length}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Team Performance</div>
            <div className="metric-trend">
              <span>→</span>
              <span>Stable</span>
            </div>
          </div>
          <div className="metric-bar">
            <div className="metric-fill" style={{ width: '70%' }}></div>
          </div>
          <div className="metric-stats">
            <span>Top Teams: 8</span>
            <span>Active: 12</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayerModal = ({ player, onClose }) => {
  if (!player) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{player.name}</h2>
          <p>{player.team} • {player.country}</p>
        </div>

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

        <div className="modal-stats">
          <div className="modal-stat">
            <div className="modal-stat-value">{player.rating}</div>
            <div className="modal-stat-label">Rating</div>
          </div>
          <div className="modal-stat">
            <div className="modal-stat-value">{player.stats.kills}</div>
            <div className="modal-stat-label">Kills</div>
          </div>
          <div className="modal-stat">
            <div className="modal-stat-value">{player.stats.assists}</div>
            <div className="modal-stat-label">Assists</div>
          </div>
          <div className="modal-stat">
            <div className="modal-stat-value">{player.stats.kd.toFixed(2)}</div>
            <div className="modal-stat-label">K/D Ratio</div>
          </div>
        </div>

        <div className="modal-details">
          <div className="detail-item">
            <div className="detail-label">Damage</div>
            <div className="detail-value">{player.stats.damage.toLocaleString()}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">ADR</div>
            <div className="detail-value">{player.stats.adr.toFixed(1)}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Entries</div>
            <div className="detail-value">{player.stats.entries}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Trend</div>
            <div className="detail-value">
              <img 
                src={getTrendIcon(player.trend)} 
                alt={player.trend}
                style={{ width: '20px', height: '20px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallbackText = document.createElement('span');
                  fallbackText.textContent = 
                    player.trend === 'up' ? '↑' : 
                    player.trend === 'down' ? '↓' : 
                    player.trend === 'new' ? '⭐' : '→';
                  fallbackText.style.color = getTrendColor(player.trend);
                  fallbackText.style.fontWeight = 'bold';
                  e.target.parentNode.appendChild(fallbackText);
                }}
              />
            </div>
          </div>
        </div>

        <div className="modal-bio">
          <h3>📈 Performance History</h3>
          <p>
            Consistent performer with strong statistics across multiple tournaments. 
            Currently ranked among the top players with excellent kill-death ratio and damage output.
          </p>
        </div>
      </div>
    </div>
  );
};

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

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        {activeTab === 'stats' && <StatsTab stats={statsData} players={playerData} />}
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

