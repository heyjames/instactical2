import axios from 'axios';
// import { apiUrl } from "../config.json";

const apiEndpoint = "/server";

export function getServerInfo() {
  return axios.get(apiEndpoint);
}

export function getCurrentPlayers() {
  console.log("getcurrentplayers api accessed");
  return axios.get(apiEndpoint + "/currentcassplayers");
}