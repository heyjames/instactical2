const servers = [
  {
    _id: "1",
    status: "Online",
    name: "insTactical.com - Slow/No Rush (San Jose)",
    ip: "155.138.240.50",
    playersOnline: "3",
    maxPlayerSlots: "8",
    playerList: ["james", "executioner", "geezer"],
    password: "1",
    xp: "0"
  },
  {
    _id: "2",
    status: "Online",
    name: "insTactical.com - Slow/No Rush (Dallas)",
    ip: "123.12.123.12",
    playersOnline: "2",
    maxPlayerSlots: "6",
    playerList: ["james2", "executioner2"],
    password: "0",
    xp: "1"
  }
];

export function getServers() {
  return servers;
}