import axios from 'axios';

const apiEndpoint = "http://localhost:3001/api/playerprofiles";

export async function getPlayerProfiles() {
  const { data } = await axios.get(apiEndpoint);
  return data;
}

export async function getPlayerProfile(steamId) {
  const { data } = await axios.get(apiEndpoint + "/" + steamId);
  return data;
}

export function createPlayerProfile(playerProfile) {
  return axios.post(apiEndpoint, playerProfile);
}

export function patchPlayerProfile(playerProfile) {
  return axios.put(apiEndpoint + "/" + playerProfile.steamId, playerProfile);
}

export function deletePlayerProfile(steamId) {
  return axios.delete(apiEndpoint + "/" + steamId);
}

// Updates the kicks array. Requires a lot of rework in 
// playerProfileKickForm.jsx. Status: Aborted.
// export function patchPlayerProfileKicks(playerProfile) {
//   return axios.put(apiEndpoint + "/" + playerProfile.steamId + "/kick", playerProfile);
// }