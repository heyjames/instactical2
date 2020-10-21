import axios from 'axios';
import jwtDecode from 'jwt-decode';
import http from './httpService';
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token";

http.setJwt(localStorage.getItem(tokenKey));

export async function login(email, password) {
  const { data: jwt } = await axios.post(apiEndpoint, { email, password });
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey)
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export default {
  login,
  logout,
  getCurrentUser,
  getJwt,
  loginWithJwt
}