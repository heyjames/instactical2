import axios from 'axios';
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/server";

export function getServerInfo() {
  return axios.get(apiEndpoint);
}

export function getCurrentPlayers() {
  console.log("getcurrentplayers api accessed");
  return axios.get(apiEndpoint + "/currentcassplayers");
}