import axios from 'axios';

const apiEndpoint = "http://localhost:3001/api/cassandraplayers";

export async function getCassandraPlayers() {
  const { data } = await axios.get(apiEndpoint);
  //console.log(data);
  return data
  // return data.sort((a, b) => (a._id < b._id) ? 1 : -1);
}

export function saveCassandraPlayer(cassandraPlayer) {
  return axios.post(apiEndpoint, cassandraPlayer);
}

export function deleteCassandraPlayer(steamId) {
  return axios.delete(apiEndpoint + "/" + steamId);
}