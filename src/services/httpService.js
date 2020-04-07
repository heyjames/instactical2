import axios from 'axios';
import auth from './authService';

function setJwt(jwt) {
  axios.defaults.headers.common['x-auth-token'] = jwt;
}

export default {
  setJwt
};