import axios from 'axios';

const apiEndpoint = "http://localhost:3001/api/auth";

export function login(email, password) {
  return axios.post(apiEndpoint, { email, password });
}