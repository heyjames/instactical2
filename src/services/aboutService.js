import axios from 'axios';

const apiEndpoint = "http://localhost:3001/api/about";

export function getAbout() {
  return axios.get(apiEndpoint);
}

export function saveAbout(about) {
  return axios.put(apiEndpoint, about);
}