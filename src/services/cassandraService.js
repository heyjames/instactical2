import axios from 'axios';

const apiEndpoint = "http://localhost:3001/api/cassandraplayers";

export async function getCassandraPlayers() {
  const { data } = await axios.get(apiEndpoint);
  return data;
  // return data.sort((a, b) => (a._id < b._id) ? 1 : -1);
}

export function createCassandraPlayer(cassandraPlayer) {
  return axios.post(apiEndpoint, cassandraPlayer);
}

export function patchCassandraPlayer(cassandraPlayer) {
  return axios.put(apiEndpoint + "/" + cassandraPlayer.steamId, cassandraPlayer);
}

// Updates the kicks array. Requires a lot of rework in 
// cassandraPlayerKickForm.jsx. Status: Aborted.
// export function patchCassandraPlayerKicks(cassandraPlayer) {
//   return axios.put(apiEndpoint + "/" + cassandraPlayer.steamId + "/kick", cassandraPlayer);
// }

export function deleteCassandraPlayer(steamId) {
  return axios.delete(apiEndpoint + "/" + steamId);
}

export async function getCassandraPlayer(steamId) {
  const { data } = await axios.get(apiEndpoint + "/" + steamId);
  return data;
}