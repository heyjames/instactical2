import axios from 'axios';

const apiEndpoint = "http://localhost:3001/api/guidelines";

export function getGuidelines() {
  return axios.get(apiEndpoint);
}

export function saveGuidelines(guidelines) {
  return axios.put(apiEndpoint, guidelines);
}