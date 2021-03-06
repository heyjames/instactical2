import axios from 'axios';
// import { apiUrl } from "../config.json";

const apiEndpoint = "/guidelines";

export function getGuidelines() {
  return axios.get(apiEndpoint);
}

export function saveGuidelines(guidelines) {
  return axios.put(apiEndpoint, guidelines);
}