import axios from 'axios';
// import auth from './authService';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

function setJwt(jwt) {
  axios.defaults.headers.common['x-auth-token'] = jwt;
}

export default {
  setJwt
};