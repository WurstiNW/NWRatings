import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import Header from './components/Header';
import Navigation from './components/Navigation';
import OverviewTab from './components/tabs/OverviewTab';
import PlayersTab from './components/tabs/PlayersTab';
import StatsTab from './components/tabs/StatsTab';
import LeaderboardsTab from './components/tabs/LeaderboardsTab';
import PlayerModal from './components/PlayerModal';

// Mock data service
import { getPlayerData, getStatsData, getTournamentData } from './services/dataService';

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setLoading(true);
      try {
        const [playerData, statsData] = await Promise.all([
          getPlayerData(),
          getStatsData()
        ]);
        setPlayers(playerData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredPlayers = players.filter(player =>
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
        {activeTab === 'overview' && <OverviewTab players={players} stats={stats} />}
        {activeTab === 'players' && (
          <PlayersTab 
            players={filteredPlayers}
            onPlayerSelect={setSelectedPlayer}
          />
        )}
        {activeTab === 'stats' && <StatsTab stats={stats} />}
        {activeTab === 'leaderboards' && <LeaderboardsTab stats={stats} players={players} />}
      </main>

      {selectedPlayer && (
        <PlayerModal 
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 BYT Tournaments. All statistics based on tournament data.</p>
          <div className="footer-links">
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;