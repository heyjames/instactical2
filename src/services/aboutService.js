import axios from 'axios';
// import { apiUrl } from "../config.json";

const apiEndpoint = "/about";

export function getAbout() {
  return axios.get(apiEndpoint);
}

export function saveAbout(about) {
  return axios.put(apiEndpoint, about);
}