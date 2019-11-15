const servers = [
  {
    _id: "1",
    status: 1,
    name: "insTactical.com - Slow/No Rush (San Jose)",
    ip: "155.138.240.50",
    playersOnline: "3",
    maxPlayerSlots: "8",
    playerList: [
      { name: "James", steamId: "76561197993336390" },
      { name: "Geezer", steamId: "76561197993336391" },
      { name: "Executioner", steamId: "76561197993336392" }
    ],
    password: "1",
    xp: 0
  },
  {
    _id: "2",
    status: 0,
    name: "insTactical.com - Slow/No Rush (Dallas)",
    ip: "123.12.123.12",
    playersOnline: "2",
    maxPlayerSlots: "6",
    playerList: [
      { name: "James", steamId: "76561197993336390" },
      { name: "Geezer", steamId: "76561197993336391" },
      { name: "Executioner", steamId: "76561197993336392" }
    ],
    password: "0",
    xp: 1
  }
];

export function getServers() {
  return servers;
}