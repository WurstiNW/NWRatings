// Mock data service
export const getPlayerData = () => {
  return Promise.resolve([
    {
      id: 1,
      name: "Zenon",
      country: "PL",
      team: "Gotei 13",
      rating: 91.9,
      trend: "down",
      image: "https://byt-tournaments.de/leaderboard/overlay/faces/1513490.png",
      stats: { 
        kills: 302, 
        assists: 45, 
        damage: 24500, 
        entries: 48,
        kd: 1.32,
        adr: 85.4
      },
      history: [89.2, 90.5, 91.2, 91.9]
    },
    // ... more players
  ]);
};

export const getStatsData = () => {
  return Promise.resolve({
    kills: [
      { player: "Achilles", country: "SE", value: 332 },
      { player: "sHype", country: "NL", value: 327 },
      // ... more stats
    ],
    // ... other stat categories
  });
};

export const getTournamentData = () => {
  return Promise.resolve({
    name: "BYT Championship 2025",
    date: "2025-01-15",
    participants: 150,
    rounds: 45,
    status: "completed"
  });
};