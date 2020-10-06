import axios from 'axios';

export function getServerInfo() {
  return axios.get("http://localhost:3001/api/server");
}

export function getCurrentPlayers() {
  console.log("getcurrentplayers api accessed");
  return axios.get("http://localhost:3001/api/server/currentcassplayers");
}